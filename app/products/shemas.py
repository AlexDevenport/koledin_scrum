from pydantic import BaseModel


class SProduct(BaseModel):
    name: str
    price: float

    class Config:
        from_attributes = True