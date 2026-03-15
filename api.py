from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
from src.monte_carlo import simulate_race
from pydantic import BaseModel

app = FastAPI()

# allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model and data once on startup
model = joblib.load("models/f1_model.pkl")
df = pd.read_csv("data/f1_features.csv")

FEATURES = [
    'grid', 'driver_avg_finish_last3', 'driver_circuit_win_rate',
    'team_avg_points_last3', 'driver_dnf_rate', 'regulation_era',
    'driver_championship_pos', 'home_race', 'gap_to_leader'
]

latest_features = (
    df[df["season"] == 2025]
    .sort_values(["driver", "round"])
    .groupby("driver")
    .last()
    .reset_index()
)


@app.get("/")
def root():
    return {"status": "F1 Predictor API is running"}


@app.api_route("/seasons", methods=["GET", "HEAD"])
def get_seasons():
    seasons = sorted(df["season"].unique().tolist(), reverse=True)
    return {"seasons": seasons}


@app.get("/races/{season}")
def get_races(season: int):
    races = df[df["season"] == season]["circuit"].unique().tolist()
    return {"races": races}


@app.get("/predict/{season}/{circuit}")
def predict_race(season: int, circuit: str):
    race_df = df[(df["season"] == season) & (df["circuit"] == circuit)].copy()
    
    if race_df.empty:
        return {"error": "Race not found"}
    
    X = race_df[FEATURES]
    race_df["win_probability"] = model.predict_proba(X)[:, 1]
    race_df["win_probability"] = race_df["win_probability"] / race_df["win_probability"].sum()
    race_df = race_df.sort_values("win_probability", ascending=False)
    
    # monte carlo
    mc_results = simulate_race(race_df, n_simulations=10000)
    mc_results = mc_results.rename(columns={"monte_carlo_win_prob": "mc_probability"})
    
    # Select columns without duplicates and merge
    result = race_df[["driver", "team", "grid", "win_probability"] + FEATURES].merge(
        mc_results[["driver", "mc_probability"]], on="driver", how="left"
    )
    
    # Replace NaN values with None (which becomes null in JSON)
    result = result.replace({np.nan: None})
    
    return {"season": season, "circuit": circuit, "predictions": result.to_dict(orient="records")}


@app.get("/feature-importance")
def feature_importance():
    importance = dict(zip(FEATURES, model.feature_importances_.tolist()))
    return {"importance": importance}

@app.get("/form/{season}/{circuit}")
def get_form(season: int, circuit: str):
    race_df = df[(df["season"] == season) & (df["circuit"] == circuit)].copy()
    
    if race_df.empty:
        return {"error": "Race not found"}
    
    form = []
    for _, row in race_df.iterrows():
        driver = row["driver"]
        team = row["team"]
        
        # get all races before this one for this driver
        driver_df = df[df["driver"] == driver].sort_values(["season", "round"])
        before = driver_df[
            (driver_df["season"] < season) |
            ((driver_df["season"] == season) & (driver_df["round"] < row["round"]))
        ]
        
        last5 = before.tail(5)["position"].tolist()
        last5 = [int(p) for p in last5 if not pd.isna(p)]
        
        if last5:
            form.append({"driver": driver, "team": team, "results": last5})
    
    return {"form": form}

class Grid2026(BaseModel):
    grid: list[str]
 
 
@app.post("/predict2026/{circuit}")
def predict_2026(circuit: str, body: Grid2026):
    rows = []
    for i, driver in enumerate(body.grid):
        driver_data = latest_features[latest_features["driver"] == driver]
        if len(driver_data) == 0:
            # use league averages for unknown drivers
            d = latest_features.mean(numeric_only=True)
            d["team"] = "racing_bulls"
        else:
            d = driver_data.iloc[0]
 
        circuit_history = df[(df["driver"] == driver) & (df["circuit"] == circuit)]
        circuit_win_rate = float(circuit_history["won"].mean()) if len(circuit_history) > 0 else 0.0
 
        rows.append({
            "driver": driver,
            "team": d["team"],
            "grid": i + 1,
            "driver_avg_finish_last3": d["driver_avg_finish_last3"],  # career form still valid
            "driver_circuit_win_rate": circuit_win_rate,
            "team_avg_points_last3": 0,       # season resets to 0
            "driver_dnf_rate": d["driver_dnf_rate"],  # career reliability still valid
            "regulation_era": 3,
            "driver_championship_pos": i + 1,  # assume quali order = rough champ standing
            "home_race": 0,
            "gap_to_leader": 0,               # season resets to 0
        })
 
    if not rows:
        return {"error": "No valid drivers provided"}
 
    pred_df = pd.DataFrame(rows)
    X = pred_df[FEATURES].fillna(0)
    pred_df["win_probability"] = model.predict_proba(X)[:, 1]
    pred_df["win_probability"] = pred_df["win_probability"] / pred_df["win_probability"].sum()
    pred_df = pred_df.sort_values("win_probability", ascending=False)
 
    mc_results = simulate_race(pred_df, n_simulations=10000)
    mc_results = mc_results.rename(columns={"monte_carlo_win_prob": "mc_probability"})
 
    result = pred_df[["driver", "team", "grid", "win_probability"] + FEATURES].merge(
        mc_results[["driver", "mc_probability"]], on="driver", how="left"
    )
    result = result.replace({np.nan: None})
 
    return {"season": 2026, "circuit": circuit, "predictions": result.to_dict(orient="records")}
