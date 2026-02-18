from app.database import async_session_maker
from app.orders import crud
from app.orders.models import Order
from app.orders.shemas import SOrder
from fastapi import APIRouter


router = APIRouter(prefix='/orders', tags=['Orders'])


# Эндпоинт для получения всех заказов
@router.get("/")
async def get_orders() -> list[SOrder]:
    
    return await crud.get_all_orders()
    

# Эндпоинт добавления заказа
@router.post("create/")
async def create_order(order: SOrder) -> SOrder:
    return await crud.add_new_order(order)