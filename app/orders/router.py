from app.database import async_session_maker
from app.orders import crud
from app.orders.shemas import SOrderBase, SCreateOrder
from fastapi import APIRouter, HTTPException, status


router = APIRouter(prefix='/orders', tags=['Orders'])


# Эндпоинт для получения всех заказов
@router.get('/')
async def get_orders() -> list[SOrderBase]:
    
    return await crud.get_all_orders()


# Эндпоинт для получения заказа по id
@router.get('/{order_id}')
async def get_order(order_id: int) -> SOrderBase:
    order = await crud.get_order_by_id(order_id)

    if order is None:
        raise HTTPException(status_code=404, detail='Order not found')

    return order


# Эндпоинт добавления заказа
@router.post('/create')
async def create_order(order: SCreateOrder) -> SCreateOrder:

    return await crud.add_new_order(order)


# Эндпоинт удаления заказа
@router.delete('/delete/{order_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int) -> None:
    deleted = await crud.delete_order_by_id(order_id)

    if not deleted:
        raise HTTPException(status_code=404, detail='Order not found')