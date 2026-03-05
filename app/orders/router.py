from app.orders.crud import OrderCrud
from app.orders import dependencies
from app.orders.models import Order
from app.orders.shemas import SResponseOrder, SOrderCreateWithItems
from fastapi import APIRouter, Depends, HTTPException, status

from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix='/api/orders', tags=['Orders'])


# Новый эндпоинт — только мои заказы
@router.get('/my', response_model=list[SResponseOrder])
async def get_my_orders(
    current_user: User = Depends(get_current_user)
):
    return await OrderCrud.get_by_user_id(current_user.id)


# Эндпоинт по id — добавить проверку принадлежности
@router.get('/{order_id}', response_model=SResponseOrder)
async def get_my_order(
    order: Order = Depends(dependencies.get_my_order)
):
    return order


# Создание заказа — добавить user_id из текущего пользователя
@router.post('/create', status_code=status.HTTP_201_CREATED, response_model=SResponseOrder)
async def create_my_order(
    order_data: SOrderCreateWithItems,
    current_user: User = Depends(get_current_user)
):
    # Защита: запрещаем создавать заказ от чужого имени
    if order_data.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Нельзя создать заказ от имени другого пользователя"
        )

    created_order = await OrderCrud.create_with_items(order_data)
    return SResponseOrder.model_validate(created_order)