# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.users.models import User
from app.users.shemas import SUser
from sqlalchemy import select


# Получение всех заказов
async def get_all_users():
    async with async_session_maker() as session:
        result = await session.execute(select(User))
        return result.scalars().all()