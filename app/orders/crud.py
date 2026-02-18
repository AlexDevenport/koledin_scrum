# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.orders.models import Order
from app.orders.shemas import SOrder
from sqlalchemy import select


# Получение всех заказов
async def get_all_orders():
    async with async_session_maker() as session:
        result = await session.execute(select(Order))
        return result.scalars().all()


# Добавление нового заказа
async def add_new_order(order_data):
    async with async_session_maker() as session:
        async with session.begin():
            new_order = Order(
                user_id=order_data.user_id,
                product_id=order_data.product_id,
                amount=order_data.amount,
            )
            session.add(new_order)
        return new_order