from annotated_types import Annotated, Ge
from pydantic import BaseModel, ConfigDict


class SProductBase(BaseModel):
    name: str
    price: Annotated[float, Ge(0)]
    description: str


class SResponseProduct(SProductBase):
    id: int


class SCreateProduct(SProductBase):
    pass


class SUpdateProduct(SCreateProduct):
    pass


class SUpdateProductPartial(BaseModel):
    name: str | None = None
    price: Annotated[float, Ge(0)] | None = None # нельзя вводить отрицательную цену
    description: str | None = None


class Product(SProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int