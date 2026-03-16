import pickle
import numpy as np

print("Loading trained model...")

with open("src/models/solar_energy_model.pkl", "rb") as f:
    model = pickle.load(f)

print("Model loaded successfully!\n")

# Take user inputs
temperature = float(input("Enter temperature (°C): "))
wind_speed = float(input("Enter wind speed (m/s): "))
humidity = float(input("Enter humidity (%): "))
hour = int(input("Enter hour of day (0-23): "))

features = np.array([[temperature, wind_speed, humidity, hour]])

prediction = model.predict(features)

print("\nPredicted Solar Radiation:", round(prediction[0], 2), "W/m²")