from sqlalchemy import Column, Float, ForeignKey, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship


class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=100))
    price = Column(Float)

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    user_id = Column(Integer)
    amount = Column(Float)

    product = relationship('Product')