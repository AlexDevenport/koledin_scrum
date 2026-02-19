from app.database import async_session_maker
from app.products import crud
from app.products.models import Product
from app.products.shemas import SProductBase, SCreateProduct, SProductPut, SProductPatch
from fastapi import APIRouter


router = APIRouter(prefix='/products', tags=['Products'])


# Эндпоинт получения всех продуктов
@router.get('/')
async def get_products() -> list[SProductBase]:
    
    return await crud.get_all_products()


# Эндпоинт полного обновления
@router.put('/update/{product_id}')
async def update_all_product() -> SProductBase:
    pass


# Эндпоинт частичного обновления
@router.patch('/update/{product_id}')
async def update_part_of_product() -> SProductBase:
    pass