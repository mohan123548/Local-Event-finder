from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository

class TaskNotFoundError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class TaskService:
    def __init__(self, tasks: TaskRepository, users: UserRepository):
        self._tasks = tasks
        self._users = users

    def list_tasks(self):
        return self._tasks.all()

    def get_task(self, task_id: int):
        if task := self._repo.find(task_id):
            return task
        raise TaskNotFoundError(f"Task with id {task_id} not found")

    def create_task(self, title: str, owner_id: int):
        if self._users.find(owner_id) is None:
            raise UserNotFoundError(owner_id)
        return self._tasks.add(title, owner_id)

    def delete_task(self, task_id: int):
        return self._tasks.remove(task_id)