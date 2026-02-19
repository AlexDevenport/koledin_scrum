from app.orders import crud
from app.orders.models import Order
from fastapi import HTTPException, Path
from typing import Annotated


# Dependencie для получения заказа по id
async def get_id_order(
    order_id: Annotated[int, Path]
) -> Order:
    order = await crud.get_order_by_id(order_id)

    if order is None:
        raise HTTPException(status_code=404, detail='Order not found')

    return order