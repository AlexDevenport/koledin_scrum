from pydantic import BaseModel, ConfigDict


class SOrderBase(BaseModel):
    product_id: int
    user_id: int
    amount: float


class SCreateOrder(SOrderBase):
    pass


class Order(SOrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int