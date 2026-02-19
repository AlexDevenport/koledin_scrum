from pydantic import BaseModel


class SOrder(BaseModel):
    id: int
    product_id: int
    user_id: int
    amount: float

    class Config:
        from_attributes = True

class SOrderCreate(BaseModel):
    product_id: int
    user_id: int
    amount: float

    class Config:
        from_attributes = True