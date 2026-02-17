from sqlalchemy import Column, Integer, String
from sqlalchemy_utils import EmailType
from app.database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(EmailType, nullable=False)
    hashed_password = Column(String, nullable=False)