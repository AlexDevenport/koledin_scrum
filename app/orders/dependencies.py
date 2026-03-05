from app.orders.crud import OrderCrud
from app.orders.models import Order
from fastapi import Depends, HTTPException, Path
from typing import Annotated

from app.users.dependencies import get_current_user
from app.users.models import User


# Dependencie для получения заказа по id
async def get_id_order(
    order_id: Annotated[int, Path]
) -> Order:
    order = await OrderCrud.get_by_id(id=order_id)

    if order is None:
        raise HTTPException(status_code=404, detail='Order not found')

    return order


async def get_my_order(
    order_id: Annotated[int, Path],
    current_user: User = Depends(get_current_user)
) -> Order:
    order = await OrderCrud.get_by_id(id=order_id)

    if order is None:
        raise HTTPException(status_code=404, detail='Заказ не найден')

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail='Это не ваш заказ'
        )

    return order