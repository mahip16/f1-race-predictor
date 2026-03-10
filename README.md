# F1 Race Win Predictor

Live demo: [your-url-here.streamlit.app](https://your-url-here.streamlit.app)

## Overview
A machine learning web app predicting F1 race win probabilities using 15 years of historical data (2010–2025).

## Results
- 97.7% accuracy and 0.066 log-loss on unseen 2023 season holdout
- Baseline comparison: 95.0% accuracy and 0.199 log-loss (always predicting no win)
- Model correctly predicted Verstappen winning 2023 Monaco GP at 62.7% probability

## Tech Stack
Python, XGBoost, scikit-learn, pandas, Streamlit, Plotly

## Features
- Select any race from 2010–2025 and see predicted win probabilities per driver
- Driver recent form chart showing finish positions across last 2 seasons
- Feature importance chart showing what the model weighted most
- Time-aware train/test split (trained 2010–2022, validated on unseen 2023 season)

## Feature Engineering
- Rolling average finish position (last 3 races, shift(1) to prevent data leakage)
- Driver win rate at specific circuit (expanding mean)
- Team average points (last 3 races)
- Driver DNF rate (expanding mean)
- Championship position and gap to leader
- Regulation era flagging (handles competitive resets in 2014 and 2022)
- Home race flag

## Data Sources
- Kaggle Formula 1 World Championship dataset (2010–2024)
- Jolpica F1 API for live 2025 race results

## Roadmap
- Qualifying gap feature (v2)
- Hyperparameter tuning via GridSearchCV
- Monte Carlo race simulation
- Adaptive retraining pipeline after each race weekend
- FastAPI + React migration