from sqlalchemy import select

from app.crud.base import BaseCrud
from app.database import async_session_maker
from app.orders.models import Order, OrderItem
from app.orders.shemas import SOrderCreateWithItems


class OrderCrud(BaseCrud):

    model = Order

    @classmethod
    async def create_with_items(
        cls,
        order_data: SOrderCreateWithItems,
    ) -> Order:
        async with async_session_maker() as session:
            async with session.begin():
                order = Order(
                    user_id=order_data.user_id,
                    total_sum=0,
                )
                session.add(order)
                await session.flush()

                total = 0

                for item in order_data.items:
                    order_item = OrderItem(
                        order_id=order.id,
                        product_id=item["product_id"],
                        quantity=item["quantity"],
                        price_at_buy=item["price_at_buy"],
                    )
                    session.add(order_item)
                    total += item["quantity"] * item["price_at_buy"]

                order.total_sum = total

            await session.refresh(order)
            return order

    @classmethod
    async def get_all(
        cls,
    ) -> list[Order]:
        async with async_session_maker() as session:
            stmt = select(cls.model).order_by(cls.model.created_at.desc())
            result = await session.execute(stmt)
            return result.scalars().all()
        

    async def get_by_user_id(self, user_id: int) -> list[Order]:
        async with async_session_maker() as session:
            query = select(self.model).where(self.model.user_id == user_id)\
                                    .order_by(self.model.created_at.desc())
            result = await session.execute(query)
            return result.scalars().all()