from sqlalchemy import Column, Float, ForeignKey, Integer
from app.database import Base
from sqlalchemy.orm import relationship


class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    amount = Column(Float)

    product = relationship('Product')
    user = relationship('User')