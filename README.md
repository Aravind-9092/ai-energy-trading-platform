#  AI Energy Trading Platform

An AI-powered solar energy trading platform that predicts solar energy generation using machine learning and makes automated buy/sell trading decisions based on supply and demand.

---

##  Project Overview

This system simulates a real-world smart energy trading platform. It takes weather inputs, runs them through a trained Random Forest ML model to predict solar radiation, calculates power generation, and decides whether to buy or sell electricity in the market.

```
Weather Input → ML Model → Energy Prediction → Trading Agent → Dashboard
```

---

## Machine Learning Model

| Detail | Value |
|--------|-------|
| Algorithm | Random Forest Regressor |
| Dataset | NASA POWER UAE Weather Data |
| Rows | 78,888 |
| Features | Temperature, Wind Speed, Humidity, Hour |
| Target | Solar Radiation (ALLSKY_SFC_SW_DWN) |
| MAE | 33.62 W/m² |
| Train/Test Split | 80% / 20% |

### Feature Importance
| Feature | Importance |
|---------|-----------|
| Hour (HR) | 0.50 |
| Humidity (RH2M) | 0.44 |
| Temperature (T2M) | 0.03 |
| Wind Speed (WS10M) | 0.01 |

---

## Trading Logic

```python
if power_generation > demand:
    decision = "SELL"
    profit = (power_generation - demand) × 0.30 AED/kWh

elif power_generation < demand:
    decision = "BUY"
    profit = -(deficit × 0.30 AED/kWh)
```

### Solar Farm Parameters
- Panel Area: 500 m²
- Efficiency: 20%
- Price: 0.30 AED/kWh

---

## Project Structure

```
ai-energy-trading-platform/
│
├── backend/
│   └── app.py                        # FastAPI backend with ML model integration
│
├── frontend/
│   └── src/
│       ├── App.jsx                   # React dashboard (dark/light theme)
│       ├── main.jsx
│       └── index.css
│
├── notebooks/
│   └── eda_analysis.ipynb            # Exploratory data analysis & correlation
│
├── src/
│   ├── agents/
│   │   └── trading_agent.py          # AI trading agent class (SELL/BUY logic)
│   │
│   ├── data_pipeline/
│   │   └── load_data.py              # Data loading and cleaning pipeline
│   │
│   ├── models/
│   │   ├── solar_energy_model.pkl    # Trained Random Forest model
│   │   └── train_model.py            # Model training script
│   │
│   ├── prediction/
│   │   ├── predict_energy.py         # Solar radiation prediction script
│   │   └── energy_production.py      # Power generation calculation
│   │
│   └── trading_engine/
│       └── energy_trading.py         # Trading simulation engine
│
├── data/
│   ├── raw/
│   │   └── uae_weather_energy_data.csv
│   └── processed/
│       └── clean_energy_weather.csv
│
├── main.py                           # Project entry point
├── README.md
└── requirements.txt
```



---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Clone the repository
```bash
git clone https://github.com/Aravind-9092/ai-energy-trading-platform.git
cd ai-energy-trading-platform
```

### 2. Set up Python environment
```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install fastapi uvicorn scikit-learn pandas numpy
```

### 4. Train the ML model
```bash
python src/models/train_model.py
```

### 5. Start the backend
```bash
uvicorn backend.app:app --reload
```

### 6. Install and start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 7. Open the dashboard
```
http://localhost:5173
```

---

## 📡 API Reference

### Base URL
```
http://127.0.0.1:8000
```

### GET /predict

Predicts solar energy generation and returns trading decision.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| temp | float | Temperature in °C (T2M) |
| wind | float | Wind speed in m/s (WS10M) |
| humidity | float | Humidity in % (RH2M) |
| hour | int | Hour of day 0–23 (HR) |

**Example Request:**
```
GET /predict?temp=28&wind=3&humidity=55&hour=12
```

**Example Response:**
```json
{
  "solar_radiation": 623.45,
  "power_generation_kw": 62.35,
  "demand_kw": 134,
  "decision": "BUY",
  "profit": -21.49,
  "forecast": [
    { "hour": 0, "power_kw": 0.0, "radiation": 0.0 },
    { "hour": 12, "power_kw": 62.35, "radiation": 623.45 }
  ]
}
```

---

##  Dashboard Sections

### 1. Dashboard
- Weather input fields — Temperature, Wind Speed, Humidity, Hour
- 5 KPI cards — Solar Radiation, Power Generation, Demand, Profit, Decision
- AI Insight panel with plain English explanation
- 24-hour energy forecast chart
- Feature importance visualization

### 2. Predictions
- Full history table of all predictions run in the session
- Columns: Time, Temp, Wind, Humidity, Hour, Radiation, Power, Demand, Decision, P&L

### 3. Trading
- Session summary — Total trades, SELL count, BUY count, Net P&L
- Trade execution log with volume and price per trade

### 4. Analytics
- Generation vs Demand bar chart
- Cumulative P&L line chart
- Decision breakdown pie chart (SELL vs BUY)
- Solar radiation per prediction bar chart

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Machine Learning | scikit-learn, Random Forest Regressor |
| Data Processing | pandas, numpy |
| Backend API | FastAPI, Uvicorn |
| Frontend | React, Vite |
| Charts | Recharts |
| HTTP Client | Axios |
| Version Control | Git, GitHub |

---

##  Dataset

| Detail | Info |
|--------|------|
| Source | NASA POWER API |
| Region | UAE |
| Size | 78,888 hourly records |
| Features | YEAR, MO, DY, HR, T2M, WS10M, ALLSKY_SFC_SW_DWN, RH2M, timestamp |

---

##  Author

**Aravind**
- GitHub: [@Aravind-9092](https://github.com/Aravind-9092)

---

##  License

This project is for educational purposes.