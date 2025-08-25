import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from the .env file
load_dotenv()

# Get connection details
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB")
COLLECTION_NAME = os.getenv("MONGO_COLLECTION")

# Establish the connection to MongoDB Atlas
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    client.admin.command('ismaster')  
    print("Successfully connected to MongoDB Atlas!")
except ConnectionFailure as e:
    print(f"Error connecting to MongoDB: {e}")
    exit()

def save_memory(user_id: str, content: str):
    """
    Saves a simple text memory for a user.

    Args:
        user_id (str): The unique identifier for the user.
        content (str): The information to be stored.
    """
    memory_document = {
        "user_id": user_id,
        "timestamp": datetime.now(),
        "content": content
    }
    
    # Insert the document into the collection
    collection.insert_one(memory_document)
    print(f"Memory saved for user {user_id}: '{content}'")

def retrieve_memories(user_id: str):
    """
    Retrieves all memories for a specific user.

    Args:
        user_id (str): The unique identifier for the user.

    Returns:
        list: A list of memory documents for the user.
    """
    memories = list(collection.find({"user_id": user_id}))
    return memories

# # --- Example Usage ---
# if __name__ == "__main__":
#     # Save some simple facts
#     save_memory("user_001", "The user's favorite color is blue.")
#     save_memory("user_001", "The user works as a software engineer.")
    
    # Retrieve and print the saved memories
    user_memories = retrieve_memories(user_id="user_001")
    print(f"\nRetrieved {len(user_memories)} memories for user user_001:")
    for memory in user_memories:
        print(f" - {memory['content']} (Saved on {memory['timestamp'].strftime('%Y-%m-%d %H:%M:%S')})")

