import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Load processed dataset
print("Loading processed dataset...")

df = pd.read_csv("data/processed/clean_energy_weather.csv")

print("Dataset Loaded")
print("Shape:", df.shape)

# Features and target
features = ["T2M", "WS10M", "RH2M", "HR"]
target = "ALLSKY_SFC_SW_DWN"

X = df[features]
y = df[target]

print("Features:", features)
print("Target:", target)

# Train-test split
print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training samples:", X_train.shape)
print("Testing samples:", X_test.shape)

# Train model
print("\nTraining Random Forest model...")

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Training Complete")

# Predictions
print("\nEvaluating model...")

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)

print("Model MAE:", mae)

# Save model
print("\nSaving model...")

with open("src/models/solar_energy_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model saved at src/models/solar_energy_model.pkl")

# Feature importance
importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(by="Importance", ascending=False)

print("\nFeature Importance:")
print(importance)