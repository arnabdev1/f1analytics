from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)  # allow cross-origin requests

# MongoDB setup
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["f1springai"]  # change to your DB name
users = db["users"]

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
