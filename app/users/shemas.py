from annotated_types import MinLen, MaxLen
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Annotated, Optional


class SUserBase(BaseModel):
    first_name: Annotated[str, MinLen(2), MaxLen(20)]
    last_name: Annotated[str, MinLen(2), MaxLen(20)]
    email: EmailStr


class SCreateUser(SUserBase):
    pass


class SUserPut(SCreateUser):
    pass


class SUserPatch(BaseModel):
    first_name: Optional[Annotated[str, MinLen(2), MaxLen(20)]] = None
    last_name: Optional[Annotated[str, MinLen(2), MaxLen(20)]] = None
    email: Optional[EmailStr] = None


class User(SUserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int