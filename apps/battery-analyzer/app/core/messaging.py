import os
import sys
import json
import asyncio
from aio_pika.abc import AbstractChannel, AbstractConnection
from fastapi import FastAPI
from aio_pika import ExchangeType, Message, connect
from app.core.logger import get_logger
from app.models.snapshot import Snapshot
from app.services.analysis_service import BatteryAnalyzer

logger = get_logger(__name__)
battery_analyzer = BatteryAnalyzer()


class RabbitMQ:
    MAX_RETRIES = 5
    RETRY_DELAY = 5  # seconds

    def __init__(self) -> None:
        self.connection: AbstractConnection | None = None
        self.channel: AbstractChannel | None = None

    async def connect(self):
        username = os.getenv("RABBITMQ_USERNAME", "")
        password = os.getenv("RABBITMQ_PASSWORD", "")
        attempt = 0

        while attempt < self.MAX_RETRIES:
            try:
                # Creating connection
                self.connection = await connect(f"amqp://{username}:{password}@rabbitmq:5672/")

                # Creating channel
                self.channel = await self.connection.channel()

                # Declare the queue and exchange and perform bindings
                await self.channel.declare_queue("battery-analyzer.snapshot.processor")
                exchange = await self.channel.declare_exchange("snapshot.received", ExchangeType.FANOUT, durable=True)
                queue = await self.channel.get_queue("battery-analyzer.snapshot.processor")
                await queue.bind(exchange, routing_key="")

                # Start consuming
                await queue.consume(self.on_message, no_ack=True)
                break
            except Exception as e:
                logger.error(f"Failed to connect to RabbitMQ: {e}")
                attempt += 1
                if attempt < self.MAX_RETRIES:
                    logger.info(f"Retrying in {self.RETRY_DELAY} seconds...")
                    await asyncio.sleep(self.RETRY_DELAY)
                else:
                    logger.error("Max retries reached, service will exit.")
                    sys.exit(1)

    async def close(self):
        if self.connection:
            await self.connection.close()

    async def publish(self, message: str):
        if not self.channel:
            return
        await self.channel.default_exchange.publish(
            Message(body=message.encode()),
            routing_key="",
        )

    async def on_message(self, message):
        logger.info("Received message from RabbitMQ.")
        try:
            body = message.body.decode()
            snapshot_data = json.loads(body)
            snapshot = Snapshot(**snapshot_data)
            logger.info(f"Processed snapshot: {snapshot.id}")

            await battery_analyzer.receive_snapshot(snapshot)
        except Exception as e:
            logger.error(e)
            logger.error(f"Error processing message: {str(e)}")


rabbitmq = RabbitMQ()


def setup_rabbitmq(app: FastAPI):
    app.add_event_handler("startup", rabbitmq.connect)
    app.add_event_handler("shutdown", rabbitmq.close)
