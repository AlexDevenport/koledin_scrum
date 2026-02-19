from annotated_types import MinLen, MaxLen
from typing import Annotated
from pydantic import BaseModel, EmailStr


class SUser(BaseModel):
    first_name: Annotated[str, MinLen(2), MaxLen(20)]
    last_name: Annotated[str, MinLen(2), MaxLen(20)]
    email: EmailStr

    class Config:
        from_attributes = True