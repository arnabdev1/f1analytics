# db.py
from pymongo import MongoClient
import os

# MongoDB setup
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)

# Pick your DB
db = client["f1springai"]

# Collections
users = db["users"]
