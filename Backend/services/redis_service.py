# redis_service.py

import redis
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create Redis connection using .env credentials
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    decode_responses=True,
    username=os.getenv("REDIS_USERNAME"),
    password=os.getenv("REDIS_PASSWORD"),
)

# =============================
# Short-term memory functions
# =============================

def save_message(session_id: str, message: str, expiry_seconds: int = 1800):
    """
    Save a message for a given session_id in Redis.
    Expires after expiry_seconds (default 30 minutes).
    """
    redis_client.rpush(session_id, message)
    redis_client.expire(session_id, expiry_seconds)


def get_conversation(session_id: str):
    """
    Retrieve the full conversation for a given session_id.
    """
    return redis_client.lrange(session_id, 0, -1)


def clear_conversation(session_id: str):
    """
    Delete all messages for a given session_id.
    """
    redis_client.delete(session_id)


# # =============================
# # Example test
# # =============================
# if __name__ == "__main__":
#     session = "user_123"

#     save_message(session, "Hello, how are you?")
#     save_message(session, "I am fine, thank you.")

#     print("Conversation:", get_conversation(session))

#     clear_conversation(session)
#     print("After clearing:", get_conversation(session))
