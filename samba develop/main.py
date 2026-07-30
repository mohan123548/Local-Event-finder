import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import auth_models, models
from .database import Base, engine
from .routers.auth import router as auth_router
from .routers.events import router as events_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Local Event Finder API",
    description=(
        "FastAPI backend for events, user registration, user login, "
        "administrator login, and login-history storage."
    ),
    version="2.0.0",
)

origins = [
    item.strip()
    for item in os.getenv(
        "FRONTEND_ORIGINS",
        (
            "http://127.0.0.1:5500,"
            "http://localhost:5500,"
            "http://127.0.0.1:5505,"
            "http://localhost:5505"
        ),
    ).split(",")
    if item.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://(127\.0\.0\.1|localhost)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)
app.include_router(auth_router)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "Local Event Finder API is running",
        "docs": "/docs",
        "database_tables": "events, users, login_audits",
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
