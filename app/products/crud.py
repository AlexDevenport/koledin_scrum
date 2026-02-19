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


# Добавление нового продукта
async def add_new_product(product_data: SCreateProduct) -> Product:
    async with async_session_maker() as session:
        async with session.begin():
            new_product = Product(
                name=product_data.name,
                price=product_data.price,
                description=product_data.description,
            )
            session.add(new_product)

        return new_product
    

# Обновление продукта методом PUT или PATCH
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
    

# Удаление продукта (пока заглушка)
async def delete_product_by_id(product: Product) -> None:
    async with async_session_maker() as session:
        product = await session.merge(product)
        await session.delete(product)
        await session.commit()