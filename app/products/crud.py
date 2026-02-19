# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.products.models import Product
from app.products.shemas import SProductBase, SCreateProduct, SProductPut, SProductPatch
from sqlalchemy import select


# Получение всех продуктов
async def get_all_products() -> list[SProductBase]:
    async with async_session_maker() as session:
        result = await session.execute(select(Product))
        return result.scalars().all()


# Обновление товара методом PUT
async def update_product_by_put():
    pass


# Обновление товара методом PATCH
async def update_product_by_patch():
    pass