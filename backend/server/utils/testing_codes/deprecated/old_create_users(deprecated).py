"""
update 2024/5/29 , you should use !curl "http://localhost:3080/dbuser/test" , in database_manual instead !!!!!
"""

import pandas as pd
from pymongo import MongoClient
import datetime
from bson.objectid import ObjectId

# Constants
MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'hackathon'  # Change to your database name
COLLECTION_NAME = 'shenusers'  # Change to your collection name

# Sample Data
sample_data = {
    "userid": "user123",
    "userName": "John Doe",
    "statusList": [
        {
            "courseId": ObjectId(),  # Example ObjectId for reference
            "status": "completed"
        }
    ],
    "learningPaths": [
        {
            "pathName": "Path 1",
            "pathId": "path1",
            "pathStatus": "ongoing",
            "items": [
                {
                    "courseId": ObjectId()  # Example ObjectId for reference
                }
            ]
        }
    ],
    "reccommendCourse": [
        {
            "courseId": ObjectId()  # Example ObjectId for reference
        }
    ],
    "tags": ["tag1", "tag2"],
    "createdAt": datetime.datetime.utcnow(),
    "updatedAt": datetime.datetime.utcnow()
}

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Insert the sample data
result = collection.insert_one(sample_data)
print(f'Data inserted with id: {result.inserted_id}')
