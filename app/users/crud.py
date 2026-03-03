from sqlalchemy import select

from app.crud.base import BaseCrud
from app.database import async_session_maker
from app.users.models import User
from app.users.shemas import SResponseUser, SCreateUser, SUpdateUser, SUpdateUserPartial

class UserCrud(BaseCrud):

    model = User
    
    
    # Обновление пользователя методом PUT
    async def update_user() -> User:
        pass


    # Обновление пользователя методом PATCH
    async def update_user_partial() -> User:
        pass