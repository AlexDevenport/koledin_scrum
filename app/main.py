from fastapi import FastAPI
from sqlalchemy import select, text
from pathlib import Path
from app.database import async_session_maker
from app.orders.models import Order
from app.orders.shemas import SOrder
from app.products.models import Product
from app.products.shemas import SProduct
from app.users.models import User


app = FastAPI()


# Создание эндпоинта для получения всех продуктов
@app.get("/products/")
async def get_products() -> list[SProduct]:
    async with async_session_maker() as session:
        query = select(Product)
        result = await session.execute(query)

        return result.scalars().all()


# Создание эндпоинта для получения всех заказов
@app.get("/orders/")
async def get_orders() -> list[SOrder]:
    async with async_session_maker() as session:
        query = select(Order)
        result = await session.execute(query)

        return result.scalars().all()
    

# Эндпоинт добавления заказа
@app.post("/create_order/")
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


# Временная ручка обновления бд
@app.post('/refresh_db/')
async def refresh_db():
    base_dir = Path(__file__).resolve().parent.parent # koledin_scrum
    sql_path = base_dir / 'data_for_postgre.sql'
    sql_script = sql_path.read_text(encoding='utf-8')
    async with async_session_maker() as session:
        async with session.begin():
            commands = sql_script.split(";")
            for command in commands:
                command = command.strip()
                if command:
                    await session.execute(text(command))

    return {'massage': 'Database filled successfully'}