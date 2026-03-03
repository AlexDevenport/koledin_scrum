from sqlalchemy import select

from app.crud.base import BaseCrud
from app.database import async_session_maker
from app.orders.models import Order
from app.orders.shemas import SResponseOrder, SCreateOrder

class OrderCrud(BaseCrud):
    
    model = Order

    # Добавление нового заказа
    async def add_order(order_data: SCreateOrder) -> Order:
        async with async_session_maker() as session:
            async with session.begin():
                new_order = Order(
                    user_id=order_data.user_id,
                    product_id=order_data.product_id,
                    amount=order_data.amount,
                )
                session.add(new_order)

            return new_order
        