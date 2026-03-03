from sqlalchemy import select

from app.crud.base import BaseCrud
from app.database import async_session_maker
from app.products.models import Product
from app.products.shemas import SResponseProduct, SCreateProduct, SUpdateProduct, SUpdateProductPartial


class ProductCrud(BaseCrud):

    model = Product
    
    # Добавление нового продукта
    async def add_product(product_data: SCreateProduct) -> Product:
        async with async_session_maker() as session:
            async with session.begin():
                new_product = Product(
                    name=product_data.name,
                    price=product_data.price,
                    description=product_data.description,
                    category=product_data.category,
                    preview_image=product_data.preview_image,
                    polygons_count=product_data.polygons_count,
                    texture_quality=product_data.texture_quality,
                    formats=product_data.formats,
                    views_count=product_data.views_count,
                    rating=product_data.rating,
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
        