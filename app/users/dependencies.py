from app.users import crud
from app.users.models import User
from fastapi import HTTPException, Path
from typing import Annotated


# Dependencie для получения пользователя по id
async def get_id_user(
    user_id: Annotated[int, Path]
) -> User:
    user = await crud.get_user_by_id(user_id)

    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    return user
