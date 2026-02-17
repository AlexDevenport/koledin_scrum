from pydantic import BaseModel


class SOrder(BaseModel):
    product_id: int
    user_id: int
    amount: float
