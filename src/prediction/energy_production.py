import pickle
import numpy as np

print("Loading trained model...")

with open("src/models/solar_energy_model.pkl", "rb") as f:
    model = pickle.load(f)

print("Model loaded successfully!\n")

# User inputs
temperature = float(input("Enter temperature (°C): "))
wind_speed = float(input("Enter wind speed (m/s): "))
humidity = float(input("Enter humidity (%): "))
hour = int(input("Enter hour of day (0-23): "))

# Solar farm parameters
panel_area = float(input("Enter solar panel area (m²): "))
efficiency = 0.20  # 20% efficiency

features = np.array([[temperature, wind_speed, humidity, hour]])

# Predict solar radiation
solar_radiation = model.predict(features)[0]

# Convert radiation → power generation
power_watts = solar_radiation * panel_area * efficiency
power_kw = power_watts / 1000

print("\nPredicted Solar Radiation:", round(solar_radiation, 2), "W/m²")
print("Estimated Power Generation:", round(power_kw, 2), "kW")