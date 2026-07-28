from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text, select
from app.auth.hashing import hash_password

from app.database import Base, engine , SessionLocal
from app.models import User
import os
from app.controllers.task_controller import router as task_router
from app.controllers.user_controller import router as user_router
from app.controllers.auth_controller import router as auth_router


def seed_users():
 """Insert two users if the table is empty."""
 with SessionLocal() as db: 
    if db.scalars(select(User)).first() is not None:
        return
    db.add_all([User(name="Meet", password_hash=hash_password("password123")),
                User(name="Doe", password_hash=hash_password("password123"))])
    db.commit()

seed_users()

app = FastAPI(title="MVC Task API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router, prefix="/tasks", tags=["tasks"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/db-ping")
def db_ping():
    engine = create_engine(os.environ["DATABASE_URL"])

    with engine.connect() as conn:
        return {
            "postgres": conn.execute(
                text("SELECT version()")
            ).scalar()
        }