from app.database import async_session_maker
from app.users import crud
from app.users.models import User
from app.users.shemas import SUserBase, SCreateUser, SUserPut, SUserPatch
from fastapi import APIRouter
from sqlalchemy import select


router = APIRouter(prefix='/users', tags=['Users'])


# Эндпоинт для получения всех пользователей
@router.get('/')
async def get_orders() -> list[SUserBase]:
    
    return await crud.get_all_users()


# Эндпоинт полного обновления
@router.put('/update/{user_id}')
async def update_all_user() -> SUserBase:
    pass


# Эндпоинт частичного обновления
@router.patch('/update/{user_id}')
async def update_part_of_user() -> SUserBase:
    pass