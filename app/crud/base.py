from sqlalchemy import select


from app.database import async_session_maker


class BaseCrud:
    model = None


    @classmethod
    async def get_all(cls):
        async with async_session_maker() as session:
            query = select(cls.model)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def get_by_id(cls, **filter):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter)
            result = await session.execute(query)
            return result.scalar_one_or_none()   