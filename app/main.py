from fastapi import FastAPI
from sqlalchemy import select
from app.shemas import OrderCreate, SProducts
from app.database import async_session_maker
from app.models import Order, Product


app = FastAPI()

# эндпоинт добавления заказа
@app.post("/purchase/")
async def create_order(order: OrderCreate):
    async with async_session_maker() as session:
        async with session.begin():
            new_order = Order(**order.model_dump())
            session.add(new_order)

    return {"message": "Order created successfully"}


#Создание эндпоинта для получения всех продуктов
@app.get("/products/")
async def get_products() -> list[SProducts]:
    async with async_session_maker() as session:
        query = select(Product)
        result = await session.execute(query)
        return result.scalars().all()