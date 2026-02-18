from app.database import async_session_maker
from app.products import crud
from app.products.models import Product
from app.products.shemas import SProduct
from fastapi import APIRouter


router = APIRouter(prefix='/products', tags=['Products'])


# Получение всех продуктов
@router.get("/")
async def get_products() -> list[SProduct]:
    
    return await crud.get_all_products()