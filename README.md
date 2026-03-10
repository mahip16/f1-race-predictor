# F1 Race Win Predictor

A machine learning web app that predicts Formula 1 race win probabilities using 15 years of historical data (2010–2025). Select any race, see predicted win probabilities per driver, and watch 10,000 simulated races play out in real time.

**Live demo:** https://f1-race-predictor-9qsmeq9t4zappcnhqtkng5.streamlit.app/
---

## What it does

- Predicts win probability for every driver on the grid before a race starts
- Runs a Monte Carlo simulation of 10,000 races accounting for DNFs, safety cars, and performance variation
- Shows each driver's recent form across the last two seasons
- Explains what the model weighted most through a feature importance chart
- Automatically retrains after every race weekend using live data from the Jolpica F1 API

---

## Results

| | Accuracy | Log Loss |
|---|---|---|
| Dumb baseline (always predict no win) | 95.0% | 0.199 |
| XGBoost model | 97.7% | 0.066 |

Accuracy alone is misleading here because only 5% of rows are wins, a model that always predicts nobody wins still gets 95% accuracy. Log loss is the more honest metric because it evaluates the quality of probability estimates, not just right or wrong predictions. The model's 0.066 vs the baseline's 0.199 means probability estimates are roughly 3x more accurate than guessing.

The model correctly predicted Verstappen winning the 2023 Monaco GP at 62.7% probability, and Norris winning the 2025 Monaco GP at 38.2% probability.

---

## Technical decisions

**Why XGBoost:**
XGBoost is the standard choice for structured tabular data. Neural networks need significantly more data to generalize well, with ~6,900 rows a neural network would likely overfit. Logistic regression was too simple because the relationship between features and winning isn't linear, going from P1 to P2 on the grid is a much bigger deal than going from P10 to P11. XGBoost handles non-linear relationships naturally, deals with missing values out of the box, and gives you feature importance for free.

**Why time-aware validation:**
A random train/test split would cause subtle data leakage, the training set might contain races from 2024 while the test set contains races from 2022, meaning the model learns from future data and gets tested on the past. That's not how real prediction works. The model trains on 2010-2022 and is tested on the unseen 2023 season, which genuinely simulates deploying the model at the start of 2023 and predicting races you've never seen before.

**Why shift(1) on rolling features:**
Every rolling feature uses shift(1) to prevent leakage at the feature level. Without it, a driver's average finish position over the last 3 races would accidentally include the current race, meaning the model sees information that wouldn't exist before race day. Shift(1) moves the window back by one so the current race is never included in its own feature calculation.

**Why the regulation era flag:**
F1 has gone through three major regulation eras since 2010, V8 engines up to 2013, V6 hybrid power units from 2014 to 2021, and ground effect aerodynamics from 2022 onwards. Each era reshuffled constructor competitiveness significantly. Without flagging these eras the model would try to learn patterns across fundamentally different competitive landscapes. The flag tells the model that a team's dominance in one era doesn't necessarily carry over to the next.

---

## Feature engineering

| Feature | Description |
|---|---|
| `grid` | Starting position |
| `driver_avg_finish_last3` | Rolling mean of finish position, last 3 races |
| `driver_circuit_win_rate` | Expanding mean of wins at this specific circuit |
| `team_avg_points_last3` | Team combined points rolling mean, last 3 races |
| `driver_dnf_rate` | Expanding mean of DNF rate |
| `regulation_era` | 0=V8, 1=V6 hybrid, 2=ground effect, 3=2026+ |
| `driver_championship_pos` | Championship position entering the race |
| `gap_to_leader` | Points gap to championship leader |
| `home_race` | Binary flag for racing at home circuit |

All rolling features use shift(1) to prevent data leakage.

---

## Monte Carlo simulation

Instead of predicting once, the simulation runs the race 10,000 times with randomness applied each iteration. Each simulation models DNF events using each driver's historical retirement rate, applies a 40% probability of a safety car period which compresses the field, and adds random performance noise to reflect on-track variation. After 10,000 simulations the win count per driver is divided by 10,000 to produce a robust probability distribution that accounts for uncertainty in a way a single model prediction cannot.

---

## Adaptive retraining pipeline

A GitHub Actions workflow runs every Monday at 9am UTC. It fetches the latest race result from the Jolpica F1 API, checks if it already exists in the dataset, and if not appends it, recalculates all rolling features, retrains the model, and commits the updated files back to the repo. Streamlit Cloud detects the new commit and redeploys automatically. The full chain requires zero manual intervention.

---

## Tech stack

Python, XGBoost, scikit-learn, pandas, numpy, Streamlit, Plotly, GitHub Actions, Jolpica F1 API

---

## Roadmap

- Qualifying gap to pole position as a feature (requires separate dataset)
- Hyperparameter tuning via GridSearchCV
- Tire degradation modeling using FastF1 lap time data
- SHAP values for per-prediction explainability
- FastAPI + React migration