"""
SQLite engine + session factory. The database file lives at
backend/db/trinetra.db — created automatically on first run via init_db().

SQLite chosen per approval for Phase 1: zero-config, file-based, and
more than sufficient for the current data volume (21 countries, a
few dozen relationship/chokepoint/entity records). The repository
layer above this is the only thing that would need to change to move
to Postgres later — see DATABASE_ARCHITECTURE.md.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.db.models import Base

DB_PATH = os.path.join(os.path.dirname(__file__), "trinetra.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db():
    """Create all tables if they don't already exist. Safe to call
    repeatedly — does not touch existing data."""
    Base.metadata.create_all(bind=engine)


def get_session():
    return SessionLocal()
