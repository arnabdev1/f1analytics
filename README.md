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


## How the ML model works:

## We use this kaggle dataset for Historic f1 data:

### We use data starting from 2001 as thats when Fernando Alonso (oldest driver in existence) had his debut
### 🔹 What happens when you ask for 2024

The dataset from Kaggle already contains the raw race results for 2024 (positions of every driver in every race).

Your ML pipeline does not just display those results directly. Instead, it:

Trains a driver-only model using all seasons before 2024 (2001–2023).

Uses that model to predict where each driver should finish in 2024 based only on their history (skill, experience).

Compares those predictions to the actual 2024 results from the Kaggle dataset.

The difference = the car effect (how much the constructor boosted or dragged the driver).

Aggregates that per constructor → what you see in the JSON.

👉 So the input data for 2024 comes from Kaggle, but the scores and rankings are the result of your ML analysis, not just raw standings.

🔹 Why this matters

If you just looked at Constructors’ Championship standings → that’s “car + driver together”.

With your ML analysis → you’re answering:
“Given what we know about the driver’s past ability, how much did the car change their performance?”

That’s why Haas shows up high in your results — not because they won the championship, but because their drivers did better than history predicted, which the model attributes to the car.

🔹 What about 2025

There are no Kaggle results for 2025 (no actual races yet).

When you query year=2025, the system trains on 2001–2024 and then projects forward.

The scores you get for 2025 are purely model predictions, not based on real race outcomes.