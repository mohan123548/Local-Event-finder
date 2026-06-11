import os 
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker  #class to map the database tables 

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    ...

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()                      #returning to database when called 