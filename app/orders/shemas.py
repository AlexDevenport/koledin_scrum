from pydantic import BaseModel


class SOrderCreate(BaseModel):
    product_id: int
    user_id: int
    amount: float