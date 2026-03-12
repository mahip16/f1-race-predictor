from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
from src.monte_carlo import simulate_race

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


@app.get("/seasons")
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
    
    # merge
    result = race_df[["driver", "team", "grid", "win_probability"]].merge(
        mc_results, on="driver", how="left"
    )
    
    return {"season": season, "circuit": circuit, "predictions": result.to_dict(orient="records")}


@app.get("/feature-importance")
def feature_importance():
    importance = dict(zip(FEATURES, model.feature_importances_.tolist()))
    return {"importance": importance}
