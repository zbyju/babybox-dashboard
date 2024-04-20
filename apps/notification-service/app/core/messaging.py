import sys
import os
import pika
import threading
import time
from fastapi import FastAPI
from pika.adapters.blocking_connection import BlockingChannel
from app.core.logger import get_logger

logger = get_logger(__name__)


class RabbitMQ:
    MAX_RETRIES = 5
    RETRY_DELAY = 5

    def __init__(self) -> None:
        self.connection = None
        self.channel: BlockingChannel | None = None

    def connect(self):
        attempt = 0
        while attempt < self.MAX_RETRIES:
            try:
                username = os.getenv("RABBITMQ_USERNAME", "")
                password = os.getenv("RABBITMQ_PASSWORD", "")
                credentials = pika.PlainCredentials(username, password)
                parameters = pika.ConnectionParameters(host="rabbitmq", port=5672, credentials=credentials)

                self.connection = pika.BlockingConnection(parameters)
                self.channel = self.connection.channel()

                # Declare a queue and bind it to the exchange
                self.channel.queue_declare(queue="notification-service.snapshot.processor")
                self.channel.queue_bind(
                    queue="notification-service.snapshot.processor",
                    exchange="snapshot.received",
                    routing_key="",
                )
                self.channel.basic_consume(
                    queue="notification-service.snapshot.processor",
                    on_message_callback=on_message,
                    auto_ack=True,
                )
                self.channel.start_consuming()
            except Exception as e:
                logger.error(f"Failed to connect to RabbitMQ: {e}")
                attempt += 1
                if attempt < self.MAX_RETRIES:
                    logger.info(f"Retrying in {self.RETRY_DELAY} seconds...")
                    time.sleep(self.RETRY_DELAY)
                else:
                    logger.error("Max retries reached, service will exit.")
                    sys.exit(1)

    def close(self):
        if self.connection:
            self.connection.close()

    def publish(self, message):
        if self.channel is None:
            return
        self.channel.basic_publish(exchange="snapshot.received", routing_key="", body=message)


rabbitmq = RabbitMQ()


def on_message(ch, method, properties, body):
    x = body.decode()
    logger.info(x)


def start_rabbitmq():
    rabbitmq.connect()


def stop_rabbitmq():
    rabbitmq.close()


def send_message(message):
    rabbitmq.publish(message)


def setup_rabbitmq(app: FastAPI):
    # Run RabbitMQ connection in a separate thread to avoid blocking
    thread = threading.Thread(target=start_rabbitmq)
    app.add_event_handler("startup", thread.start)
    app.add_event_handler("shutdown", stop_rabbitmq)
