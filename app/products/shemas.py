from typing import Optional
from pydantic import BaseModel, ConfigDict


class SProductBase(BaseModel):
    name: str
    price: float
    description: str


class SCreateProduct(SProductBase):
    pass


class SProductPut(SCreateProduct):
    pass


class SProductPatch(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None


class Product(SProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int