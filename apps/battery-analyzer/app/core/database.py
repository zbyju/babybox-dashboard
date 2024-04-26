import sys
import time
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
import os
from app.core.logger import get_logger


class DataBase:
    client: AsyncIOMotorClient
    db_name: str = os.getenv("MONGODB_DATABASE", "")


db = DataBase()
logger = get_logger(__name__)


def get_database_url() -> str:
    host = "mongodb"
    port = "27017"
    database_name = db.db_name
    return f"mongodb://{host}:{port}/{database_name}"


def connect_to_mongo():
    MAX_RETRIES = 5
    RETRY_DELAY = 5
    attempt = 0
    while attempt < MAX_RETRIES:
        try:
            db.client = AsyncIOMotorClient(get_database_url())
            logger.info("Connected to the MongoDB database.")
            break
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            attempt += 1
            if attempt < MAX_RETRIES:
                logger.info(f"Retrying in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                logger.error("Max retries reached, service will exit.")
                sys.exit(1)


def close_mongo_connection():
    db.client.close()


def startup_db_client(app: FastAPI):
    app.add_event_handler("startup", connect_to_mongo)
    app.add_event_handler("shutdown", close_mongo_connection)
