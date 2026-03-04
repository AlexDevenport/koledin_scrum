from fastapi import Request, HTTPException, Path
from typing import Annotated

from app.users.crud import UserCrud
from app.users.models import User

# Dependencie для получения пользователя по id
async def get_id_user(
    user_id: Annotated[int, Path]
) -> User:
    user = await UserCrud.get_by_id(id=user_id)

    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    return user


async def get_current_user(request: Request):
    user_id = request.cookies.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = await UserCrud.get_by_id(id=int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
