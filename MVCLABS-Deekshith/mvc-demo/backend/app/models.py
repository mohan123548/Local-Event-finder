from typing import List

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
 
from app.database import Base
 
class Task(Base):
    __tablename__ = 'tasks'
 
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="tasks")

class User(Base):
    __tablename__ = 'users'
 
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(200), unique=True, index=True)    

    tasks: Mapped[List["Task"]] = relationship(back_populates="owner")
