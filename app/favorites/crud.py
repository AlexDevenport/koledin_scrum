from sqlalchemy import delete, select

from app.crud.base import BaseCrud
from app.database import async_session_maker
from app.favorites.models import Favorite
from app.products.models import Product


class FavoriteCrud(BaseCrud):
    model = Favorite


    # Получение всех товаров из избранного пользователя
    async def get_all_by_user(self, user_id: int) -> list[Favorite]:
        async with async_session_maker() as session:
            query = select(self.model).where(self.model.user_id == user_id)
            result = await session.execute(query)
            return result.scalars().all()


    async def get_by_user_and_product(self, user_id: int, product_id: int) -> Favorite | None:
        async with async_session_maker() as session:
            query = select(self.model).where(
                self.model.user_id == user_id,
                self.model.product_id == product_id
            )
            result = await session.execute(query)
            return result.scalar_one_or_none()


    # Добавление товара в избранное
    async def add_favorite(self, user_id: int, product_id: int) -> Favorite | None:
        async with async_session_maker() as session:
            
            # Проверяем существование продукта
            product_query = select(Product).where(Product.id == product_id)
            product_result = await session.execute(product_query)
            if not product_result.scalar_one_or_none():
                return "product_not_found"

            # Проверяем, нет ли уже в избранном
            exists = await self.get_by_user_and_product(user_id, product_id)
            if exists:
                return "already_exists"

            # Добавляем
            obj = self.model(user_id=user_id, product_id=product_id)
            session.add(obj)
            await session.commit()
            await session.refresh(obj)
            return obj


    async def remove_by_user_and_product(self, user_id: int, product_id: int) -> bool:
        async with async_session_maker() as session:
            stmt = delete(self.model).where(
                self.model.user_id == user_id,
                self.model.product_id == product_id
            )
            result = await session.execute(stmt)
            await session.commit()
            return result.rowcount > 0