from app.orders import crud
from app.orders import dependencies
from app.orders.models import Order
from app.orders.shemas import SResponseOrder, SCreateOrder
from fastapi import APIRouter, Depends, status


router = APIRouter(prefix='/orders', tags=['Orders'])


# Эндпоинт для получения всех заказов
@router.get('/')
async def get_orders() -> list[SResponseOrder]:
    
    return await crud.get_all_orders()


# Эндпоинт для получения заказа по id
@router.get('/{order_id}')
async def get_order(
    order: Order = Depends(dependencies.get_id_order)
) -> SResponseOrder | None:

    return order


# Эндпоинт добавления заказа
@router.post('/create', status_code=status.HTTP_201_CREATED)
async def create_order(order: SCreateOrder) -> SResponseOrder:

    return await crud.add_new_order(order)


# Эндпоинт удаления заказа
@router.delete('/delete/{order_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order: Order = Depends(dependencies.get_id_order)
) -> None:
    await crud.delete_order_by_id(order)