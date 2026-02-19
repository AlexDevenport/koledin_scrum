from app.users import crud
from app.users.models import User
from app.users.shemas import SResponseUser, SCreateUser, SUpdateUser, SUpdateUserPartial
from fastapi import APIRouter


router = APIRouter(prefix='/users', tags=['Users'])


# Эндпоинт для получения всех пользователей
@router.get('/')
async def get_orders() -> list[SResponseUser]:
    
    return await crud.get_all_users()


# Эндпоинт полного обновления пользователя
@router.put('/update/{user_id}')
async def update_all_user() -> SResponseUser:
    pass


# Эндпоинт частичного обновления пользователя
@router.patch('/update/{user_id}')
async def update_part_of_user() -> SResponseUser:
    pass