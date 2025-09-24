from flask import Flask, request, jsonify
from flask_cors import CORS
from db import users
from ml_model import fetch_results, get_constructor_rankings

app = Flask(__name__)
CORS(app)

_DATA = None

def get_data():
    global _DATA
    if _DATA is None:
        _DATA = fetch_results(2001, 2024)
    return _DATA


@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask!"})


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if users.find_one({"email": email}):
        return jsonify({"success": False, "message": "User already exists"}), 400

    users.insert_one({"email": email, "password": password})
    return jsonify({"success": True, "message": "Signup successful"})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    if user["password"] != password:
        return jsonify({"success": False, "message": "Incorrect password"}), 401

    return jsonify({"success": True, "message": "Login successful"})


@app.route("/ml/constructor-rankings", methods=["GET"])
def constructor_rankings():
    try:
        df = get_data()
        year = int(request.args.get("year", df["year"].max()))
        result = get_constructor_rankings(df, year)

        return jsonify({
            "success": True,
            "year": result["year"],
            "model_stats": result["model_stats"],
            "rankings": result["constructor_rankings"].to_dict(orient="records")
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
