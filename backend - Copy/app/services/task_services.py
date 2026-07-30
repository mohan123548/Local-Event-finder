from app.models import User
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository


class TaskNotFoundError(Exception):
    pass


class UserNotFoundError(Exception):
    pass


class NotAuthorizedError(Exception):
    pass


class TaskService:
    def __init__(self, tasks: TaskRepository, users: UserRepository):
        self._tasks = tasks
        self._users = users

    def _resolve_user_id(self, current_user):
        return current_user if isinstance(current_user, int) else current_user.id

    def list_tasks(self, current_user) -> list[User]:
        user_id = self._resolve_user_id(current_user)
        return self._tasks.all_for_user(user_id)

    def get_user_task(self, current_user_id: int):
        return self._tasks.all_for_user(current_user_id)

    def create_task(self, title: str, current_user) -> object:
        title = title.strip()
        if not title:
            raise ValueError("Title cannot be empty")

        user_id = self._resolve_user_id(current_user)
        if self._users.find(user_id) is None:
            raise UserNotFoundError(user_id)

        return self._tasks.add(title, user_id)

    def delete_task(self, task_id: int):
        return self._tasks.remove(task_id)

    def delete_others_task(self, task_id: int, current_user):
        user_id = self._resolve_user_id(current_user)
        task = self._tasks.find(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)
        if task.owner_id != user_id:
            raise NotAuthorizedError(task_id)
        return self._tasks.remove(task_id)

    def get_task(self, task_id: int):
        task = self._tasks.find(task_id)
        if task is None:
            raise TaskNotFoundError(task_id)
        return task

    def get_another_user_and_task(self, task_id: int, current_user):
        user_id = self._resolve_user_id(current_user)
        task = self._tasks.find(task_id)
        if task is None or task.owner_id != user_id:
            raise TaskNotFoundError(task_id)
        return task
    