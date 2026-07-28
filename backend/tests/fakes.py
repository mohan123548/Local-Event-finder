from typing import List, Optional, Dict
 
from app.models import Task, User
 
 
class FakeTaskRepository:
    def __init__(self) -> None:
        self.tasks: List[Task] = []
        self._next_id: int = 1
 
    def all_for_user(self, owner_id: int) -> List[Task]:
        return [t for t in self.tasks if t.owner_id == owner_id]
 
    def find(self, task_id: int) -> Task | None:
        return next((t for t in self.tasks if t.id == task_id), None)
 
    def add(self, title: str, owner_id: int) -> Task:
        self._next_id += 1
        task = Task(id=self._next_id, title=title, owner_id=owner_id)
        self.tasks.append(task)
        return task
 
    def remove(self, task_id: int) -> bool:
        task = self.find(task_id)
        if task is None:
            return False
        self.tasks.remove(task)
        return True
 
 
class FakeUserRepository:
    def __init__(self, users: Optional[List[User]] = None) -> None:
        self._users: Dict[int, User] = {u.id: u for u in (users or [])}
 
    def find(self, user_id: int) -> Optional[User]:
        return self._users.get(user_id)