from app.database import async_session_maker
from app.users.models import User
from app.users.shemas import SUser
from fastapi import APIRouter
from sqlalchemy import select


router = APIRouter(prefix='/users', tags=['Users'])


# Эндпоинт для получения всех заказов
@router.get("/")
async def get_users() -> list[SUser]:
    async with async_session_maker() as session:
        query = select(User)
        result = await session.execute(query)

        return result.scalars().all()