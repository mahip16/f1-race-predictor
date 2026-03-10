import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.express as px
from src.monte_carlo import simulate_race

st.set_page_config(
    page_title="F1 Race Predictor",
    page_icon="🏎️",
    layout="wide"
)

@st.cache_resource
def load_model():
    return joblib.load("models/f1_model.pkl")

@st.cache_data
def load_data():
    return pd.read_csv("data/f1_features.csv")

model = load_model()
df = load_data()

# header
st.title("🏎️ F1 Race Win Predictor")
st.markdown("Predicting race win probabilities using 15 years of historical data")

# sidebar
st.sidebar.header("Select a Race")

season = st.sidebar.selectbox(
    "Season",
    sorted(df["season"].unique(), reverse=True)
)

race_options = df[df["season"] == season]["circuit"].unique()
race = st.sidebar.selectbox("Race", race_options)

race_df = df[(df["season"] == season) & (df["circuit"] == race)].copy()

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

# get predictions
X = race_df[FEATURES]
race_df["win_probability"] = model.predict_proba(X)[:, 1]
race_df["win_probability"] = race_df["win_probability"] / race_df["win_probability"].sum()
race_df = race_df.sort_values("win_probability", ascending=False)

st.header(f"🏁 {race} {season} — Win Probabilities")

fig = px.bar(
    race_df.head(10),
    x="win_probability",
    y="driver",
    orientation="h",
    color="team",
    title="Predicted Win Probabilities",
    labels={"win_probability": "Win Probability", "driver": "Driver"}
)
fig.update_layout(yaxis={"categoryorder": "total ascending"})
st.plotly_chart(fig, use_container_width=True)

# show probability table
st.subheader("📊 Full Probability Table")
display_df = race_df[["driver", "team", "grid", "win_probability"]].copy()
display_df["win_probability"] = (display_df["win_probability"] * 100).round(1).astype(str) + "%"
display_df.columns = ["Driver", "Team", "Grid", "Win Probability"]
st.dataframe(display_df, use_container_width=True)

# driver recent form chart
st.subheader("📈 Driver Recent Form")
top5_drivers = race_df.head(5)["driver"].tolist()
form_df = df[df["driver"].isin(top5_drivers)].copy()
form_df = form_df[form_df["season"] >= int(season) - 1]

fig2 = px.line(
    form_df,
    x="round",
    y="position",
    color="driver",
    facet_col="season",
    title="Finish Position — Top 5 Predicted Drivers (lower is better)",
    labels={"position": "Finish Position", "round": "Round"}
)
fig2.update_yaxes(autorange="reversed")
st.plotly_chart(fig2, use_container_width=True)

# feature importance
st.subheader("🧠 What The Model Weighted Most")
importance_df = pd.DataFrame({
    "feature": FEATURES,
    "importance": model.feature_importances_
}).sort_values("importance", ascending=True)

fig3 = px.bar(
    importance_df,
    x="importance",
    y="feature",
    orientation="h",
    title="Feature Importance",
    labels={"importance": "Importance Score", "feature": "Feature"}
)
st.plotly_chart(fig3, use_container_width=True)

# monte carlo simulation
st.subheader("🎲 Monte Carlo Simulation (10,000 races)")
st.caption("Simulates the race 10,000 times with random DNFs, safety cars, and performance variation")

with st.spinner("Running simulation..."):
    mc_results = simulate_race(race_df, n_simulations=10000)
    mc_results["monte_carlo_win_prob"] = mc_results["monte_carlo_win_prob"] * 100

fig4 = px.bar(
    mc_results.head(10),
    x="monte_carlo_win_prob",
    y="driver",
    orientation="h",
    title="Win Probability after 10,000 Simulated Races",
    labels={"monte_carlo_win_prob": "Win Probability (%)", "driver": "Driver"}
)
fig4.update_layout(yaxis={"categoryorder": "total ascending"})
st.plotly_chart(fig4, use_container_width=True)