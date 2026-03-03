from app.products.crud import ProductCrud
from app.products.models import Product
from fastapi import HTTPException, Path
from typing import Annotated


# Dependencie для получения продукта по id
async def get_id_product(
    product_id: Annotated[int, Path]
) -> Product:
    product = await ProductCrud.get_by_id(id=product_id)

    if product is None:
        raise HTTPException(status_code=404, detail='Product not found')

    return product
