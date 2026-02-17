from fastapi import FastAPI
from sqlalchemy import select, delete
from app.database import async_session_maker
from app.orders.models import Order
from app.orders.shemas import SOrderCreate
from app.products.models import Product
from app.products.shemas import SProducts
from app.users.models import User


app = FastAPI()


# Эндпоинт добавления заказа
@app.post("/purchase/")
async def create_order(order: SOrderCreate) -> dict:
    async with async_session_maker() as session:
        async with session.begin():
            new_order = Order(**order.model_dump())
            session.add(new_order)

    return {"message": "Order created successfully"}


# Создание эндпоинта для получения всех продуктов
@app.get("/products/")
async def get_products() -> list[SProducts]:
    async with async_session_maker() as session:
        query = select(Product)
        result = await session.execute(query)
        return result.scalars().all()
    

from pathlib import Path
from sqlalchemy import text
# Временная ручка обновления бд
@app.post('/refresh_db')
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