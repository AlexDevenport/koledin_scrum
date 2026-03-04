from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response
from sqlalchemy import select

from app.users import dependencies
from app.users.auth import authenticate_user, get_password_hash, verify_password
from app.users.crud import UserCrud
from app.users.models import User
from app.users.shemas import SResponseUser, SCreateUser, SUpdateUser, SUpdateUserPartial, SUserAuth
from app.database import async_session_maker



router = APIRouter(prefix='/api/users', tags=['Users'])


# Эндпоинт для получения всех пользователей
@router.get('/')
async def get_users() -> list[SResponseUser]:
    
    return await UserCrud.get_all()


# Эндпоинт для получения пользователя по id
@router.get('/{user_id}')
async def get_user(
    user: User = Depends(dependencies.get_id_user)
) -> SResponseUser | None:

    return user


# Эндпоинт полного обновления пользователя
@router.put('/update/{user_id}')
async def update_all_user() -> SResponseUser:
    pass


# Эндпоинт частичного обновления пользователя
@router.patch('/update/{user_id}')
async def update_part_of_user() -> SResponseUser:
    pass



@router.post("/register")
async def register(
    response: Response,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...)
):
    existing_user = await UserCrud.get_by_id(email=email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = get_password_hash(password)
    user = await UserCrud.add(
        first_name=first_name,
        last_name=last_name,
        email=email,
        hashed_password=hashed_password
    )
    response.set_cookie(
        key="user_id",
        value=str(user.id),
        httponly=True,
        samesite="lax"
    )
    


@router.post("/login")
async def login(
    response: Response,
    email: str = Form(...),
    password: str = Form(...)
):
    user = await UserCrud.get_by_id(email=email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    response.set_cookie(
        key="user_id",
        value=str(user.id),
        httponly=True,
        samesite="lax"
    )
    



@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("user_id")




# @router.get("/me")
# async def get_me(current_user: User = Depends(dependencies.get_current_user)):
#     return {
#         "id": current_user.id,
#         "first_name": current_user.first_name,
#         "last_name": current_user.last_name,
#         "email": current_user.email,
#         "bonus_points": current_user.bonus_points,
#         "created_at": current_user.created_at
#     }