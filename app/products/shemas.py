from pydantic import BaseModel


class SProduct(BaseModel):
    name: str
    price: float  