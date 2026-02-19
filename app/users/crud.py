# Здесь будет осуществляться работа с БД
from app.database import async_session_maker
from app.users.models import User
from app.users.shemas import SUserBase, SCreateUser, SUserPut, SUserPatch
from sqlalchemy import select


# Получение всех заказов
async def get_all_users() -> list[SUserBase]:
    async with async_session_maker() as session:
        result = await session.execute(select(User))
        return result.scalars().all()
    

# Обновление пользователя методом PUT
async def update_user_by_put():
    pass


# Обновление пользователя методом PATCH
async def update_user_by_patch():
    pass