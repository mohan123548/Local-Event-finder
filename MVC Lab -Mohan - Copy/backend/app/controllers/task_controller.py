from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import Task, TaskCreate
from app.services.task_service import TaskService, TaskNotFoundError
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.database import get_db


router = APIRouter()

def get_task_repo(db: Session = Depends(get_db)) -> TaskRepository:
    return TaskRepository(db)

def get_user_repo(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

def get_task_service(repo: TaskRepository = Depends(get_task_repo), user_repo: UserRepository = Depends(get_user_repo)) -> TaskService:
    return TaskService(repo, user_repo)

@router.get("/", response_model=list[Task])
def get_tasks(service: TaskService = Depends(get_task_service)):
    try:
        return service.list_tasks()
    except TaskNotFoundError:
        raise HTTPException(status_code=404, detail="No tasks found")


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: int, service: TaskService = Depends(get_task_service)):
    try:
        return service.get_task(task_id)
    except TaskNotFoundError:
        raise HTTPException(status_code=404, detail="Task not found")

@router.post("/", response_model=Task, status_code=201)
def create_task(payload: TaskCreate, service: TaskService = Depends(get_task_service)):
    try:
        return service.create_task(payload.title, payload.owner_id)
    except ValueError as e:
        raise HTTPException(status_code=4, detail=str(e))

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, service: TaskService = Depends(get_task_service)):
    deleted = service.delete_task(task_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")