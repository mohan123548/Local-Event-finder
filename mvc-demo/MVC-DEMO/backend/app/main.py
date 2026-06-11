from fastapi import FastAPI                            # FastAPI is the web framework used to build the API
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.task_controller import router as task_router
from sqlalchemy import create_engine, text
import os
 
from app.database import Base, engine
from app import models 

app = FastAPI(title="MVC Task API")

Base.metadata.create_all(bind=engine)  #create tables in the database if they don't exist
 
@app.get("/db-ping")
def db_ping():
    engine = create_engine(os.environ["DATABASE_URL"])
    with engine.connect() as conn:
       return {"postgres": conn.execute(text("SELECT version()")).scalar()}
 
#the view runs on a different origin, so CORS is required
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
app.include_router(task_router, prefix="/tasks", tags=["tasks"])