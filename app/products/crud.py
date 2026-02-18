# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.products.models import Product
from sqlalchemy import select


# Получение всех продуктов
async def get_all_products():
    async with async_session_maker() as session:
        result = await session.execute(select(Product))
        return result.scalars().all()
