# Pydantic-схемы

from pydantic import BaseModel


class OrderCreate(BaseModel):
    product_id: int
    user_id: int
    amount: float


class SProducts(BaseModel):
    name: str
    price: float  