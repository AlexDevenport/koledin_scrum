from sqlalchemy import Column, Float, Integer, String
from app.database import Base


class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=100))
    price = Column(Float)
    description = Column(String, nullable=True)