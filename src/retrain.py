import requests
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime


def fetch_latest_race():
    url = "https://api.jolpi.ca/ergast/f1/current/last/results.json"
    response = requests.get(url)
    data = response.json()
    
    race = data["MRData"]["RaceTable"]["Races"][0]
    season = int(race["season"])
    round_num = int(race["round"])
    circuit = race["Circuit"]["circuitId"]
    results = race["Results"]
    
    rows = []
    for r in results:
        rows.append({
            "season": season,
            "round": round_num,
            "circuit": circuit,
            "driver": r["Driver"]["driverId"],
            "team": r["Constructor"]["constructorId"],
            "grid": int(r["grid"]),
            "position": int(r["position"]) if r["position"].isdigit() else 20,
            "points": float(r["points"]),
            "status": r["status"]
        })
    
    return pd.DataFrame(rows)


def race_already_exists(df, season, round_num):
    return ((df["season"] == season) & (df["round"] == round_num)).any()


def recalculate_features(df):
    df = df.sort_values(["driver", "season", "round"]).reset_index(drop=True)
    
    # clean null values from Jolpica
    df = df.replace("\\N", np.nan)
    df["position"] = pd.to_numeric(df["position"], errors="coerce").fillna(20)
    df["grid"] = pd.to_numeric(df["grid"], errors="coerce").fillna(20)
    df["points"] = pd.to_numeric(df["points"], errors="coerce").fillna(0)
    
    df["won"] = (df["position"] == 1).astype(int)
    
    finished_statuses = ["Finished", "Lapped", "+1 Lap", "+2 Laps",
                         "+3 Laps", "+4 Laps", "+5 Laps"]
    df["dnf"] = (~df["status"].isin(finished_statuses)).astype(int)
    
    df["driver_avg_finish_last3"] = (
        df.groupby("driver")["position"]
        .transform(lambda x: x.shift(1).rolling(3, min_periods=1).mean())
    )
    
    df["driver_circuit_win_rate"] = (
        df.groupby(["driver", "circuit"])["won"]
        .transform(lambda x: x.shift(1).expanding().mean())
    )
    
    df["driver_dnf_rate"] = (
        df.groupby("driver")["dnf"]
        .transform(lambda x: x.shift(1).expanding().mean())
    )
    
    # aggregate team points before rolling to avoid teammate contamination
    team_points = df.groupby(["season", "round", "team"])["points"].sum().reset_index()
    team_points["team_avg_points_last3"] = (
        team_points.groupby("team")["points"]
        .transform(lambda x: x.shift(1).rolling(3, min_periods=1).mean())
    )
    df = df.merge(team_points[["season", "round", "team", "team_avg_points_last3"]],
                  on=["season", "round", "team"], how="left")
    
    df["cumulative_points"] = df.groupby(["season", "driver"])["points"].cumsum()
    df["driver_championship_pos"] = (
        df.groupby(["season", "round"])["cumulative_points"]
        .rank(ascending=False, method="min")
    )
    df["driver_championship_pos"] = (
        df.groupby("driver")["driver_championship_pos"]
        .transform(lambda x: x.shift(1))
    )
    
    df["gap_to_leader"] = (
        df.groupby(["season", "round"])["cumulative_points"]
        .transform("max") - df["cumulative_points"]
    )
    df["gap_to_leader"] = (
        df.groupby("driver")["gap_to_leader"]
        .transform(lambda x: x.shift(1))
    )
    
    def get_era(season):
        if season <= 2013: return 0
        elif season <= 2021: return 1
        elif season <= 2025: return 2
        else: return 3
    df["regulation_era"] = df["season"].apply(get_era)
    
    df["home_race"] = 0
    
    return df


def retrain_model(df):
    FEATURES = [
        'grid', 'driver_avg_finish_last3', 'driver_circuit_win_rate',
        'team_avg_points_last3', 'driver_dnf_rate', 'regulation_era',
        'driver_championship_pos', 'home_race', 'gap_to_leader'
    ]
    
    from xgboost import XGBClassifier
    
    X = df[FEATURES]
    y = df["won"]
    
    model = XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss'
    )
    model.fit(X, y)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    joblib.dump(model, f"models/f1_model_{timestamp}.pkl")
    joblib.dump(model, "models/f1_model.pkl")
    print(f"Model retrained and saved at {timestamp}")
    
    return model


if __name__ == "__main__":
    print("Fetching latest race...")
    new_race = fetch_latest_race()
    season = new_race["season"].iloc[0]
    round_num = new_race["round"].iloc[0]
    
    print(f"Latest race: Season {season}, Round {round_num}")
    
    df = pd.read_csv("data/f1_data.csv")
    
    if race_already_exists(df, season, round_num):
        print("Race already in dataset. No update needed.")
    else:
        print("New race found. Appending to dataset...")
        df = pd.concat([df, new_race], ignore_index=True)
        df.to_csv("data/f1_data.csv", index=False)
        
        print("Recalculating features...")
        df_features = recalculate_features(df)
        df_features.to_csv("data/f1_features.csv", index=False)
        
        print("Retraining model...")
        retrain_model(df_features)
        
        print("Pipeline complete.")