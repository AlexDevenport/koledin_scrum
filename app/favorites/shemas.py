from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class SFavoriteBase(BaseModel):
    product_id: int = Field(..., ge=1)


class SFavoriteCreate(SFavoriteBase):
    pass


class SFavoriteResponse(SFavoriteBase):
    id: int = Field(..., ge=1)
    user_id: int = Field(..., ge=1)

    model_config = ConfigDict(from_attributes=True)


class SFavoriteCheckResponse(BaseModel):
    in_favorites: bool