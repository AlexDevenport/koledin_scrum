from app.orders.crud import OrderCrud
from app.orders import dependencies
from app.orders.models import Order
from app.orders.shemas import SResponseOrder, SCreateOrder
from fastapi import APIRouter, Depends, status


router = APIRouter(prefix='/api/orders', tags=['Orders'])


# Эндпоинт для получения всех заказов
@router.get('/')
async def get_orders() -> list[SResponseOrder]:
    
    return await OrderCrud.get_all()


# Эндпоинт для получения заказа по id
@router.get('/{order_id}')
async def get_order(
    order: Order = Depends(dependencies.get_id_order)
) -> SResponseOrder | None:

    return order


# Эндпоинт добавления заказа
@router.post('/create', status_code=status.HTTP_201_CREATED)
async def create_order(order: SCreateOrder) -> SResponseOrder:

    return await OrderCrud.add_order(order)