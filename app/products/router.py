from app.products import crud
from app.products import dependencies
from app.products.models import Product
from app.products.shemas import SResponseProduct, SCreateProduct, SUpdateProduct, SUpdateProductPartial
from fastapi import APIRouter, Depends


router = APIRouter(prefix='/products', tags=['Products'])


# Эндпоинт получения всех продуктов
@router.get('/')
async def get_products() -> list[SResponseProduct]:
    
    return await crud.get_all_products()


# Эндпоинт для получения продукта по id
@router.get('/{product_id}')
async def get_product(
    product: Product = Depends(dependencies.get_id_product)
) -> SResponseProduct | None:

    return product


# Эндпоинт полного обновления продукта
@router.put('/update/{product_id}')
async def update_product(
    product_update: SUpdateProduct,
    product: Product = Depends(dependencies.get_id_product),
) -> SResponseProduct:
    return await crud.update_product(
        product=product,
        product_update=product_update
    )


# Эндпоинт частичного обновления продукта
@router.patch('/update/{product_id}')
async def update_product_partial(
    product_update: SUpdateProductPartial,
    product: Product = Depends(dependencies.get_id_product),
) -> SResponseProduct:
    return await crud.update_product(
        product=product,
        product_update=product_update,
        partial=True
    )