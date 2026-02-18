from app.database import async_session_maker
from app.products.models import Product
from app.products.shemas import SProduct
from fastapi import APIRouter
from sqlalchemy import select


router = APIRouter(prefix='/products', tags=['Products'])


# Получение всех продуктов
@router.get("/")
async def get_products() -> list[SProduct]:
    async with async_session_maker() as session:
        query = select(Product)
        result = await session.execute(query)

        return result.scalars().all()