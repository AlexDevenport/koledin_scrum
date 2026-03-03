from fastapi import APIRouter, Depends

from app.users import dependencies
from app.users.crud import UserCrud
from app.users.models import User
from app.users.shemas import SResponseUser, SCreateUser, SUpdateUser, SUpdateUserPartial



router = APIRouter(prefix='/api/users', tags=['Users'])


# Эндпоинт для получения всех пользователей
@router.get('/')
async def get_users() -> list[SResponseUser]:
    
    return await UserCrud.get_all()


# Эндпоинт для получения пользователя по id
@router.get('/{user_id}')
async def get_user(
    user: User = Depends(dependencies.get_id_user)
) -> SResponseUser | None:

    return user


# Эндпоинт полного обновления пользователя
@router.put('/update/{user_id}')
async def update_all_user() -> SResponseUser:
    pass


# Эндпоинт частичного обновления пользователя
@router.patch('/update/{user_id}')
async def update_part_of_user() -> SResponseUser:
    pass