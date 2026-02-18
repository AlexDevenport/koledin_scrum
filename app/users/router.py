from app.database import async_session_maker
from app.users import crud
from app.users.models import User
from app.users.shemas import SUser
from fastapi import APIRouter
from sqlalchemy import select


router = APIRouter(prefix='/users', tags=['Users'])


# Эндпоинт для получения всех пользователей
@router.get("/")
async def get_orders() -> list[SUser]:
    
    return await crud.get_all_users()