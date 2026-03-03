from annotated_types import Annotated, Ge
from pydantic import BaseModel, ConfigDict, Field


class SOrderBase(BaseModel):
    user_id: int = Field(..., ge=1)
    total_sum: Annotated[int, Ge(0)]


class SResponseOrder(SOrderBase):
    id: int = Field(..., ge=1)

    model_config = ConfigDict(from_attributes=True)


class SOrderCreateWithItems(BaseModel):
    user_id: int = Field(..., ge=1)
    items: list[dict] = Field(
        ...,
        description="Список товаров: [{'product_id': int, 'quantity': int, 'price_at_buy': int}]"
    )