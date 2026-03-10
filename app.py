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

latest_features = (
    df[df["season"] == 2025]
    .sort_values(["driver", "round"])
    .groupby("driver")
    .last()
    .reset_index()
)

# header
st.title("🏎️ F1 Race Win Predictor")
st.markdown("Predicting race win probabilities using 15 years of historical data")

# sidebar
st.sidebar.header("Select a Race")
mode = st.sidebar.radio("Mode", ["Historical Races", "Predict 2026 Race"])

if mode == "Historical Races":
    season = st.sidebar.selectbox(
        "Season",
        sorted(df["season"].unique(), reverse=True)
    )

    race_options = df[df["season"] == season]["circuit"].unique()
    race = st.sidebar.selectbox("Race", race_options)

    race_df = df[(df["season"] == season) & (df["circuit"] == race)].copy()

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

elif mode == "Predict 2026 Race":

    calendar_2026 = {
        "Australian GP": "albert_park",
        "Chinese GP": "shanghai",
        "Japanese GP": "suzuka",
        "Bahrain GP": "bahrain",
        "Saudi Arabian GP": "jeddah",
        "Miami GP": "miami",
        "Canadian GP": "villeneuve",
        "Monaco GP": "monaco",
        "Barcelona GP": "catalunya",
        "Austrian GP": "red_bull_ring",
        "British GP": "silverstone",
        "Belgian GP": "spa",
        "Hungarian GP": "hungaroring",
        "Dutch GP": "zandvoort",
        "Italian GP": "monza",
        "Azerbaijan GP": "baku",
        "Singapore GP": "marina_bay",
        "US GP": "americas",
        "Mexico GP": "rodriguez",
        "Brazilian GP": "interlagos",
        "Las Vegas GP": "vegas",
        "Qatar GP": "losail",
        "Abu Dhabi GP": "yas_marina"
    }

    drivers_2026 = [
        "norris", "max_verstappen", "piastri", "russell", "leclerc",
        "hamilton", "sainz", "alonso", "antonelli", "hadjar",
        "tsunoda", "lawson", "albon", "bearman", "hulkenberg",
        "ocon", "stroll", "gasly", "doohan", "bortoleto", "colapinto", "lindblad"
    ]

    selected_race = st.sidebar.selectbox("Select 2026 Race", list(calendar_2026.keys()))
    circuit_id = calendar_2026[selected_race]

    st.header(f"🏁 2026 {selected_race} — Predicted Win Probabilities")
    st.caption("Enter qualifying order to generate predictions")

    st.subheader("Enter Qualifying Order")
    grid_input = []
    for i in range(1, 21):
        driver = st.selectbox(f"P{i}", [""] + drivers_2026, key=f"grid_{i}")
        if driver:
            grid_input.append(driver)

    if len(grid_input) >= 5:
        rows = []
        for i, driver in enumerate(grid_input):
            driver_data = latest_features[latest_features["driver"] == driver]
            if len(driver_data) == 0:
                continue
            driver_data = driver_data.iloc[0]

            circuit_history = df[(df["driver"] == driver) & (df["circuit"] == circuit_id)]
            circuit_win_rate = circuit_history["won"].mean() if len(circuit_history) > 0 else 0.0

            rows.append({
                "driver": driver,
                "grid": i + 1,
                "driver_avg_finish_last3": driver_data["driver_avg_finish_last3"],
                "driver_circuit_win_rate": circuit_win_rate,
                "team_avg_points_last3": driver_data["team_avg_points_last3"],
                "driver_dnf_rate": driver_data["driver_dnf_rate"],
                "regulation_era": 3,
                "driver_championship_pos": driver_data["driver_championship_pos"],
                "home_race": 0,
                "gap_to_leader": driver_data["gap_to_leader"]
            })

        pred_df = pd.DataFrame(rows)
        X = pred_df[FEATURES].fillna(0)
        pred_df["win_probability"] = model.predict_proba(X)[:, 1]
        pred_df["win_probability"] = pred_df["win_probability"] / pred_df["win_probability"].sum()
        pred_df = pred_df.sort_values("win_probability", ascending=False)

        fig = px.bar(
            pred_df,
            x="win_probability",
            y="driver",
            orientation="h",
            title=f"Predicted Win Probabilities — 2026 {selected_race}",
            labels={"win_probability": "Win Probability", "driver": "Driver"}
        )
        fig.update_layout(yaxis={"categoryorder": "total ascending"})
        st.plotly_chart(fig, use_container_width=True)

        st.subheader("🎲 Monte Carlo Simulation (10,000 races)")
        with st.spinner("Running simulation..."):
            mc_results = simulate_race(pred_df, n_simulations=10000)
            mc_results["monte_carlo_win_prob"] = mc_results["monte_carlo_win_prob"] * 100

        fig2 = px.bar(
            mc_results.head(10),
            x="monte_carlo_win_prob",
            y="driver",
            orientation="h",
            title="Win Probability after 10,000 Simulated Races",
            labels={"monte_carlo_win_prob": "Win Probability (%)", "driver": "Driver"}
        )
        fig2.update_layout(yaxis={"categoryorder": "total ascending"})
        st.plotly_chart(fig2, use_container_width=True)

    else:
        st.info("Enter at least 5 drivers in qualifying order to generate predictions.")