from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import random
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained Random Forest model
# Feature order used during training: T2M, WS10M, RH2M, HR
MODEL_PATH = "src/models/solar_energy_model.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

print("✅ Random Forest model loaded successfully")

PANEL_AREA_M2 = 500    # m²
EFFICIENCY    = 0.20   # 20%
PRICE_PER_KWH = 0.30   # AED

@app.get("/")
def home():
    return {"message": "AI Energy Trading API Running"}

@app.get("/predict")
def predict(temp: float, wind: float, humidity: float, hour: int):

    # Feature order must match training: T2M, WS10M, RH2M, HR
    features = np.array([[temp, wind, humidity, hour]])

    # Real ML prediction from your Random Forest model
    solar_radiation = float(model.predict(features)[0])
    solar_radiation = max(0.0, round(solar_radiation, 2))

    # Power (W) = Radiation x Area x Efficiency → convert to kW
    power_kw = round((solar_radiation * PANEL_AREA_M2 * EFFICIENCY) / 1000.0, 2)

    # Simulated market demand
    demand_kw = random.randint(50, 200)

    # Trading decision
    if power_kw > demand_kw:
        decision = "SELL"
        profit   = round((power_kw - demand_kw) * PRICE_PER_KWH, 2)
    elif power_kw < demand_kw:
        decision = "BUY"
        profit   = round(-((demand_kw - power_kw) * PRICE_PER_KWH), 2)
    else:
        decision = "HOLD"
        profit   = 0.0

    # 24-hour forecast using your ML model
    forecast = []
    for h in range(24):
        h_rad = float(model.predict(np.array([[temp, wind, humidity, h]]))[0])
        h_rad = max(0.0, round(h_rad, 2))
        h_power = round((h_rad * PANEL_AREA_M2 * EFFICIENCY) / 1000.0, 2)
        forecast.append({"hour": h, "power_kw": h_power, "radiation": h_rad})

    return {
        "solar_radiation":     solar_radiation,
        "power_generation_kw": power_kw,
        "demand_kw":           demand_kw,
        "decision":            decision,
        "profit":              profit,
        "forecast":            forecast,
    }