from datetime import datetime
from sqlalchemy import DateTime, func

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column , relationship

from app.database import Base
 
class Task(Base):
    __tablename__ = 'tasks'
 
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))

    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="tasks")

created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column( primary_key=True)
    username: Mapped[str] = mapped_column(String(200), unique=True, index=True)
   # email: Mapped[str] = mapped_column(String(200), unique=True, index=True)

    tasks: Mapped[list["Task"]] = relationship(back_populates="owner")