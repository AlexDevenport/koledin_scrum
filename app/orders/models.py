from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database import Base


class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    total_sum = Column(Integer, nullable=False)

    user = relationship("User", back_populates="orders") # двунаправленная связь
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan") # двунаправленная связь


class OrderItem(Base):
    __tablename__ = 'order_items'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, default=1, server_default='1') # количество
    price_at_buy = Column(Integer, nullable=False)

    order = relationship('Order', back_populates='items')
    product = relationship('Product')