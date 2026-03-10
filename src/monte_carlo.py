import numpy as np
import pandas as pd
import joblib

model = joblib.load("models/f1_model.pkl")
df = pd.read_csv("data/f1_features.csv")

FEATURES = [
    'grid',
    'driver_avg_finish_last3',
    'driver_circuit_win_rate',
    'team_avg_points_last3',
    'driver_dnf_rate',
    'regulation_era',
    'driver_championship_pos',
    'home_race',
    'gap_to_leader'
]

def simulate_race(race_df, n_simulations=10000):
    """
    Run Monte Carlo simulation for a given race.
    Returns win probability for each driver based on n_simulations.
    """
    drivers = race_df["driver"].values
    X = race_df[FEATURES]
    
    # get base probabilities from model
    base_probs = model.predict_proba(X)[:, 1]
    base_probs = base_probs / base_probs.sum()  # normalize to sum to 1
    
    win_counts = {driver: 0 for driver in drivers}
    
    for _ in range(n_simulations):
        # add random noise to simulate uncertainty
        # DNF events - each driver has a chance of retiring
        dnf_mask = np.random.random(len(drivers)) < race_df["driver_dnf_rate"].values
        
        # safety car effect - randomly bunches the field
        safety_car = np.random.random() < 0.4  # 40% chance of safety car
        
        # copy base probs and apply noise
        sim_probs = base_probs.copy()
        
        # apply random performance noise
        noise = np.random.normal(0, 0.02, len(drivers))
        sim_probs = sim_probs + noise
        
        # remove DNF drivers first
        sim_probs[dnf_mask] = 0

        # clip negatives before sqrt
        sim_probs = np.clip(sim_probs, 0, None)

        # if safety car, compress probabilities (field bunches up)
        if safety_car:
            sim_probs = sim_probs ** 0.5
        
        # normalize and pick winner
        sim_probs = np.clip(sim_probs, 0, None)
        if sim_probs.sum() == 0:
            continue
        sim_probs = sim_probs / sim_probs.sum()
        
        winner = np.random.choice(drivers, p=sim_probs)
        win_counts[winner] += 1
    
    # convert to probabilities
    results = pd.DataFrame({
        "driver": list(win_counts.keys()),
        "monte_carlo_win_prob": [v / n_simulations for v in win_counts.values()]
    }).sort_values("monte_carlo_win_prob", ascending=False)
    
    return results


if __name__ == "__main__":
    # test on 2023 Monaco GP
    race_df = df[(df["season"] == 2023) & (df["circuit"] == "monaco")].copy()
    results = simulate_race(race_df, n_simulations=10000)
    print(results.head(10))
