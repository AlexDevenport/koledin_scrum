from annotated_types import Annotated, Ge
from pydantic import BaseModel, ConfigDict


class SOrderBase(BaseModel):
    product_id: int
    user_id: int
    amount: Annotated[float, Ge(0)] | None = None # нельзя вводить отрицательную цену


class SResponseOrder(SOrderBase):
    id: int


class SCreateOrder(SOrderBase):
    pass


class Order(SOrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int