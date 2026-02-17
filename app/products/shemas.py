from pydantic import BaseModel


class SProducts(BaseModel):
    name: str
    price: float  