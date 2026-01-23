from fastapi import FastAPI
from app.shemas import OrderCreate
from app.database import async_session_maker
from app.models import Order

app = FastAPI()

# эндпоинт добавления заказа
@app.post("/purchase/")
async def create_order(order: OrderCreate):
    async with async_session_maker() as session:
        async with session.begin():
            new_order = Order(**order.model_dump())
            session.add(new_order)

    return {"message": "Order created successfully"}