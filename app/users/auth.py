from passlib.context import CryptContext
from pydantic import EmailStr


from app.users.crud import UserCrud

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def authenticate_user(email: EmailStr, password: str):
    user = await UserCrud.get_by_id(email=email)
    if not user and not verify_password(password, user.hashed_password):
        return None
    return user
