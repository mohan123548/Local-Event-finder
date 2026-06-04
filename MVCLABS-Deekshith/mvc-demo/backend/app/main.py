from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from app.controllers.task_controller import router as task_router
 
app = FastAPI(title="MVC Task API")
 
# The frontend runs on a different origin, so CORS is required
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
app.include_router(task_router, prefix="/tasks", tags=["tasks"])