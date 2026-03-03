from annotated_types import Annotated, Ge
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional


class SProductBase(BaseModel):
    name: str = Field(..., max_length=100)
    price: Annotated[float, Ge(0)]
    description: str | None = None

    category: str = Field(..., max_length=20)
    preview_image: Optional[str] = Field(None, max_length=255)

    polygons_count: Annotated[int, Ge(0)] = 0
    texture_quality: Optional[str] = Field(None, max_length=20)
    formats: Optional[List[str]] = None

    views_count: Annotated[int, Ge(0)] = 0
    rating: Annotated[float, Ge(0), Field(le=5)] = 0.0


class SResponseProduct(SProductBase):
    id: int


class SCreateProduct(SProductBase):
    pass


class SUpdateProduct(SCreateProduct):
    pass


class SUpdateProductPartial(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    price: Annotated[int, Ge(0)] | None = None
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=20)
    preview_image: Optional[str] = Field(None, max_length=255)
    polygons_count: Annotated[int, Ge(0)] | None = None
    texture_quality: Optional[str] = Field(None, max_length=20)
    formats: Optional[List[str]] = None
    views_count: Annotated[int, Ge(0)] | None = None
    rating: Annotated[float, Ge(0), Field(le=5)] | None = None


class Product(SProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int