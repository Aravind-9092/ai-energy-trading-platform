import pickle
import numpy as np
import random

print("\n===================================")
print("      AI ENERGY TRADING PLATFORM")
print("===================================")

print("\nCurrency: AED (UAE Dirham)")

# Load trained AI model
print("\nLoading AI forecasting model...")

with open("src/models/solar_energy_model.pkl", "rb") as f:
    model = pickle.load(f)

print("Model loaded successfully!")

# Weather inputs
print("\nEnter Weather Conditions\n")

temperature = float(input("Temperature (°C): "))
wind_speed = float(input("Wind Speed (m/s): "))
humidity = float(input("Humidity (%): "))
hour = int(input("Hour of Day (0-23): "))

# Solar farm configuration
print("\nSolar Farm Configuration\n")

panel_area = float(input("Solar Panel Area (m²): "))
efficiency = 0.20  # 20% solar panel efficiency

# Prepare input for model
features = np.array([[temperature, wind_speed, humidity, hour]])

# Predict solar radiation
solar_radiation = model.predict(features)[0]

# Convert solar radiation → electricity
power_watts = solar_radiation * panel_area * efficiency
power_kw = power_watts / 1000

# Simulate electricity demand
demand = random.randint(100, 200)

# UAE electricity market price
price_per_kwh = 0.30  # AED

# ===== REPORT OUTPUT =====

print("\n===================================")
print("        AI ENERGY REPORT")
print("===================================")

print("\nWeather Conditions")
print("-------------------")
print("Temperature:", temperature, "°C")
print("Wind Speed:", wind_speed, "m/s")
print("Humidity:", humidity, "%")
print("Hour:", hour)

print("\nEnergy Forecast")
print("-------------------")
print("Predicted Solar Radiation:", round(solar_radiation, 2), "W/m²")
print("Estimated Power Generation:", round(power_kw, 2), "kW")

print("\nMarket Conditions")
print("-------------------")
print("Electricity Demand:", demand, "kW")
print("Market Price:", price_per_kwh, "AED/kWh")

print("\nTrading Decision")
print("-------------------")

# Trading logic
if power_kw > demand:

    surplus = power_kw - demand
    revenue = surplus * price_per_kwh

    print("AI Decision: SELL ENERGY")
    print("Energy Sold:", round(surplus, 2), "kW")
    print("Revenue Earned:", round(revenue, 2), "AED")

elif power_kw < demand:

    deficit = demand - power_kw
    cost = deficit * price_per_kwh

    print("AI Decision: BUY ENERGY")
    print("Energy Purchased:", round(deficit, 2), "kW")
    print("Cost:", round(cost, 2), "AED")

else:

    print("Perfect Energy Balance - No Trading Required")

print("\n===================================")
print("      END OF ENERGY REPORT")
print("===================================\n")