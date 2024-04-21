from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import healthcheck
from app.api.endpoints import notifications
from app.api.endpoints import templates
from app.core.database import startup_db_client
from app.core.messaging import setup_rabbitmq

import logging

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(healthcheck.router)

app.include_router(
    templates.router,
    prefix="/v1/templates",
    tags=["templates"],
)
app.include_router(
    notifications.router,
    prefix="/v1/notifications",
    tags=["notifications"],
)

startup_db_client(app)
setup_rabbitmq(app)
