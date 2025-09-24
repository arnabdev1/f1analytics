import os
import pandas as pd
import numpy as np
from collections import defaultdict

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

try:
    import kagglehub
    from kagglehub import KaggleDatasetAdapter
    KAGGLEHUB_AVAILABLE = True
except Exception:
    KAGGLEHUB_AVAILABLE = False

DATA_CACHE_PATH = "data/combined_results.parquet"
DATASET_REF = "rohanrao/formula-1-world-championship-1950-2020"


# ----------------------
# Helper for picking flexible column names
# ----------------------
def pick_col(df, candidates):
    for c in candidates:
        if c in df.columns:
            return c
    return None


# ----------------------
# Load CSV from Kaggle or fallback local
# ----------------------
def load_csv(filename):
    if KAGGLEHUB_AVAILABLE:
        try:
            print(f"Loading {filename} via kagglehub…")
            return kagglehub.load_dataset(
                KaggleDatasetAdapter.PANDAS,
                DATASET_REF,
                filename
            )
        except Exception as e:
            print(f"kagglehub failed for {filename}: {e}, falling back to local.")

    local_path = os.path.join("data", filename)
    if os.path.exists(local_path):
        return pd.read_csv(local_path)
    raise FileNotFoundError(f"{filename} not found via kagglehub or local path {local_path}")


# ----------------------
# Merge results + races + drivers + constructors
# ----------------------
def fetch_results(start_year=2001, end_year=2024, force_reload=False):
    if os.path.exists(DATA_CACHE_PATH) and not force_reload:
        df = pd.read_parquet(DATA_CACHE_PATH)
        return df[(df["year"] >= start_year) & (df["year"] <= end_year)]

    results = load_csv("results.csv")
    races = load_csv("races.csv")
    drivers = load_csv("drivers.csv")
    constructors = load_csv("constructors.csv")

    # map column names
    results = results.rename(columns={
        pick_col(results, ["raceId"]): "raceId",
        pick_col(results, ["driverId"]): "driverId",
        pick_col(results, ["constructorId"]): "constructorId",
        pick_col(results, ["positionOrder", "position"]): "position"
    })

    races = races.rename(columns={
        pick_col(races, ["raceId"]): "raceId",
        pick_col(races, ["year"]): "year",
        pick_col(races, ["round"]): "round",
        pick_col(races, ["name"]): "raceName"
    })

    drivers = drivers.rename(columns={pick_col(drivers, ["driverId"]): "driverId"})
    drivers["driver"] = drivers[pick_col(drivers, ["forename", "givenName"])] + " " + drivers[pick_col(drivers, ["surname", "familyName"])]

    constructors = constructors.rename(columns={pick_col(constructors, ["constructorId"]): "constructorId"})
    constructors["constructor"] = constructors[pick_col(constructors, ["name", "constructorRef"])]

    df = (
        results
        .merge(races[["raceId", "year", "round", "raceName"]], on="raceId", how="left")
        .merge(drivers[["driverId", "driver"]], on="driverId", how="left")
        .merge(constructors[["constructorId", "constructor"]], on="constructorId", how="left")
    )

    df["position"] = pd.to_numeric(df["position"], errors="coerce")
    df = df[df["position"].notnull() & (df["position"] > 0)]
    df = df[(df["year"] >= start_year) & (df["year"] <= end_year)]

    os.makedirs("data", exist_ok=True)
    df.to_parquet(DATA_CACHE_PATH, index=False)

    return df


# ----------------------
# Feature engineering
# ----------------------
def add_history_features(df):
    df = df.copy()
    df["driver_hist_pos_mean"] = np.nan
    df["constructor_hist_pos_mean"] = np.nan
    df["driver_experience_years"] = np.nan

    global_mean = df["position"].mean()
    debut_year = df.groupby("driver")["year"].min().to_dict()

    drv_stats = defaultdict(lambda: {"sum": 0.0, "count": 0})
    con_stats = defaultdict(lambda: {"sum": 0.0, "count": 0})

    for year in sorted(df["year"].unique()):
        idxs = df[df["year"] == year].index
        for i in idxs:
            d = df.at[i, "driver"]
            c = df.at[i, "constructor"]

            df.at[i, "driver_hist_pos_mean"] = (
                drv_stats[d]["sum"] / drv_stats[d]["count"] if drv_stats[d]["count"] > 0 else global_mean
            )
            df.at[i, "constructor_hist_pos_mean"] = (
                con_stats[c]["sum"] / con_stats[c]["count"] if con_stats[c]["count"] > 0 else global_mean
            )
            df.at[i, "driver_experience_years"] = max(0, df.at[i, "year"] - debut_year.get(d, df.at[i, "year"]))

        for i in idxs:
            d = df.at[i, "driver"]
            c = df.at[i, "constructor"]
            pos = df.at[i, "position"]

            drv_stats[d]["sum"] += pos
            drv_stats[d]["count"] += 1
            con_stats[c]["sum"] += pos
            con_stats[c]["count"] += 1

    return df


# ----------------------
# Train driver-only model
# ----------------------
def train_driver_model(df, target_year):
    df_feat = add_history_features(df)
    train_df = df_feat[df_feat["year"] < target_year]

    X = train_df[["driver_hist_pos_mean", "driver_experience_years"]]
    y = train_df["position"]

    model = RandomForestRegressor(n_estimators=200, max_depth=8, random_state=42, n_jobs=-1)
    model.fit(X, y)

    y_pred = model.predict(X)
    mae = mean_absolute_error(y, y_pred)
    r2 = r2_score(y, y_pred)

    return model, {"train_mae": mae, "train_r2": r2}


# ----------------------
# Constructor rankings
# ----------------------
def get_constructor_rankings(df, target_year=2024):
    model, stats = train_driver_model(df, target_year)

    df_feat = add_history_features(df)
    test_df = df_feat[df_feat["year"] == target_year].copy()

    X_test = test_df[["driver_hist_pos_mean", "driver_experience_years"]]
    y_test = test_df["position"]
    y_pred = model.predict(X_test)

    test_df["car_effect"] = y_pred - y_test

    agg = (
        test_df.groupby("constructor")
        .agg(score_mean=("car_effect", "mean"),
             score_std=("car_effect", "std"),
             races=("car_effect", "count"))
        .sort_values("score_mean", ascending=False)
        .reset_index()
    )

    return {
        "year": int(target_year),
        "model_stats": stats,
        "constructor_rankings": agg
    }
