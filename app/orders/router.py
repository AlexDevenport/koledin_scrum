from fastapi import APIRouter
from app.database import async_session_maker
from sqlalchemy import select
from app.orders.models import Order
from app.orders.shemas import SOrder


router = APIRouter(prefix='/orders', tags=['Orders'])


# Эндпоинт для получения всех заказов
@router.get("/")
async def get_orders() -> list[SOrder]:
    async with async_session_maker() as session:
        query = select(Order)
        result = await session.execute(query)

        return result.scalars().all()
    

# Эндпоинт добавления заказа
@router.post("create/")
async def create_order(order: SOrder) -> dict:
    async with async_session_maker() as session:
        async with session.begin():
            new_order = new_order = Order(
                user_id=order.user_id,
                product_id=order.product_id,
                amount=order.amount
            )
            session.add(new_order)

    return {"message": "Order created successfully"}