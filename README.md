# 🏎️ F1 InsightHub — Machine Learning Model Overview  

Welcome to **F1 InsightHub**, an open-source Formula 1 analytics and prediction platform.  
This project combines 🏁 **Spring AI + PostgreSQL** (structured backend & chatbot), 🏎️ **Flask + MongoDB** (ML microservice), and 🎨 **React + Tailwind** (frontend) to deliver interactive dashboards, predictions, and insights into car vs driver performance.  

---

## 🚦 Tech Stack  
**Frontend:** React, TypeScript, Tailwind CSS  
**Backends:** Spring AI, Flask, REST APIs  
**Databases:** PostgreSQL, MongoDB  
**Machine Learning:** scikit-learn, pandas, numpy, joblib, SHAP  
**Other Tools:** Docker, OpenAI API, Kaggle datasets  

---

## 🏁 Overview of Features  
- 🔐 **Secure User Login** with Spring Security (JWT & refresh tokens)  
- 📊 **Dashboard with live F1 standings & charts** via Ergast/Kaggle APIs  
- 🤖 **AI Chatbot** powered by Spring AI + OpenAI API, enriched with ML model insights  
- 🧠 **Machine Learning predictions**: ranking constructors based on driver-adjusted performance  
- 🗄 **Dual-database design**: PostgreSQL for structured F1 results, MongoDB for telemetry + ML metadata  

---

# 🧠 How the ML Model Works  

We use this Kaggle dataset for historic F1 data:  
👉 [Formula 1 World Championship Dataset (1950–2020)](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020)  

### 📅 Data Range  
We start analysis from **2001** (Fernando Alonso’s debut — the oldest active driver 🐐).  

---

### 🔹 Asking About 2024  
- Kaggle contains **raw race results for 2024**.  
- Our ML pipeline does **not** just echo those results. Instead:  
  1. Train a **driver-only model** on 2001–2023 (predicts where drivers should finish *independent of cars*).  
  2. Use that model to predict 2024 finishes (based on skill & experience history).  
  3. Compare predictions vs real 2024 outcomes.  
  4. The difference = **car effect**.  
  5. Aggregate by constructor → **car rankings** JSON.  

👉 **So Haas can outrank Ferrari in our analysis** not because of championships, but because their drivers exceeded expectations relative to history → a “car boost” effect.  

---

### 🔹 Why This Matters  
- Constructors’ standings = **car + driver combined**.  
- Our ML = **“how much did the car help or hurt the driver?”**  
- Example: Lewis Hamilton in a weaker Ferrari might underperform, while a rookie in McLaren could shine because of the car’s strength.  

---

### 🔹 Projections for 2025  
- No Kaggle data yet → no real outcomes.  
- Model trains on 2001–2024.  
- Predicts 2025 car rankings → **pure forecasts**.  

---

### ⚙️ Technical Aspects  
- **Features:** qualifying positions, previous season stats, driver transfers, constructor points, reliability metrics, pit stop performance.  
- **Model:** Logistic Regression / XGBoost with driver/team embeddings.  
- **Evaluation:**  
  - Regression (finishing position RMSE/MAE).  
  - Ranking (Spearman correlation with constructor standings).  
  - Classification (podium probability ROC-AUC).  
- **Explainability:** SHAP values → per-team explanations of why the model ranked them high/low.  
- **Persistence:** model artifacts stored with `joblib`, metadata & insights stored in MongoDB.  

---



## 🛠️ Project Setup & Run Guide

Follow the steps below to run the project locally:

---

### ▶️ Frontend (React)

```bash
# Navigate to the frontend directory
cd frontend
# Install dependencies
npm install
# Run the development server
npm run dev
```

### ▶️ Backend (Flask)

```bash
# Navigate to the backend directory
cd backend-flask
# Run the development server
python3 -m venv venv
source venv/bin/activate
pip install pymongo flask_cors flask requests pandas scikit-learn statsmodels kaggle kagglehub joblib pyarrow

python3 app.py
```

