# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.orders.models import Order
from app.orders.shemas import SOrder, SOrderCreate
from sqlalchemy import select


# Получение всех заказов
async def get_all_orders() -> list[SOrder]:
    async with async_session_maker() as session:
        result = await session.execute(select(Order))

        return result.scalars().all()


# Получение заказа по id
async def get_order_by_id(order_id: int) -> SOrder:
    async with async_session_maker() as session:

        return await session.get(Order, order_id)
    

# Добавление нового заказа
async def add_new_order(order_data: SOrderCreate) -> SOrder:
    async with async_session_maker() as session:
        async with session.begin():
            new_order = Order(
                user_id=order_data.user_id,
                product_id=order_data.product_id,
                amount=order_data.amount,
            )
            session.add(new_order)

        return new_order
    

# Удаление заказа
async def delete_order_by_id(order_id: int) -> None:
    async with async_session_maker() as session:
        order = await session.get(Order, order_id)

        if order is None:
            return False
        
        await session.delete(order)
        await session.commit()
        return True