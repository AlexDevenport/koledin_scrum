from annotated_types import MinLen, MaxLen
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Annotated


class SUserBase(BaseModel):
    first_name: Annotated[str, MinLen(2), MaxLen(20)]
    last_name: Annotated[str, MinLen(2), MaxLen(20)]
    email: EmailStr


class SResponseUser(SUserBase):
    id: int = Field(..., ge=1)


class SCreateUser(SUserBase):
    pass


class SUpdateUser(SCreateUser):
    pass


class SUpdateUserPartial(BaseModel):
    first_name: Annotated[str, MinLen(2), MaxLen(20)] | None = None
    last_name: Annotated[str, MinLen(2), MaxLen(20)] | None = None
    email: EmailStr | None = None


class User(SUserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., ge=1)

class SUserAuth(BaseModel):
    email: EmailStr
    password: str        