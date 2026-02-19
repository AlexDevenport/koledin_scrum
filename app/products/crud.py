# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.products.models import Product
from app.products.shemas import SResponseProduct, SCreateProduct, SUpdateProduct, SUpdateProductPartial
from sqlalchemy import select


# Получение всех продуктов
async def get_all_products() -> list[Product]:
    async with async_session_maker() as session:
        result = await session.execute(select(Product))
        return result.scalars().all()


# Получение продукта по id
async def get_product_by_id(product_id: int) -> Product | None:
    async with async_session_maker() as session:

        return await session.get(Product, product_id)


# Обновление товара методом PUT или PATCH
async def update_product(
    product: Product,
    product_update: SUpdateProduct | SUpdateProductPartial,
    partial: bool = False
) -> Product:
    async with async_session_maker() as session:
        product = await session.merge(product)
        update_data = product_update.model_dump(exclude_unset=partial)

        for name, value in update_data.items():
            setattr(product, name, value)

        await session.commit()
        await session.refresh(product)

        return product