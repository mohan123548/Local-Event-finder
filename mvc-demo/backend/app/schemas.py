from pydantic import BaseModel, ConfigDict, Field    #pydantic is used for data validation 

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=2000)

class Task(TaskCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)