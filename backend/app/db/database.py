from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./wardrobe.db" #for sqlite

#creating engine (to connect python to db)
engine = create_engine(
    DATABASE_URL,
    connect_args = {"check_same_thread": False}
)

#creating a session factory (to talk to db)
SessionLocal = sessionmaker(
    autocommit = False,
    autoflush = False,
    bind=engine
)

#base class for all db models
Base = declarative_base()