from fastapi import APIRouter, Depends, status, HTTPException, Query

from app.favorites.crud import FavoriteCrud
from app.favorites.shemas import SFavoriteCreate, SFavoriteResponse, SFavoriteCheckResponse
from app.users.dependencies import get_current_user
from app.users.models import User


router = APIRouter(
    prefix='/api/favorite', tags=['Favorites'],
    dependencies=[Depends(get_current_user)]
)


favorite_crud = FavoriteCrud()


# Получение всех товаров, добавленных в избранное
@router.get('/')
async def get_my_favorites(
    current_user: User = Depends(get_current_user)
) -> list[SFavoriteResponse]:
    items = await favorite_crud.get_all_by_user(current_user.id)
    
    return items


# Добавление товара в избранное
@router.post('/', status_code=status.HTTP_201_CREATED)
async def add_to_favorites(
    data: SFavoriteCreate,
    current_user: User = Depends(get_current_user)
) -> SFavoriteCreate | None | str:
    result = await favorite_crud.add_favorite(
        user_id=current_user.id,
        product_id=data.product_id
    )

    if isinstance(result, str):
        if result == "product_not_found":
            raise HTTPException(
                status_code=404,
                detail=f"Product not found"
            )
        if result == "already_exists":
            raise HTTPException(
                status_code=409,
                detail="Product is already in favorites"
            )

    return result


# Удаление товара из избранного
@router.delete('/{product}', status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_favorites(
    product_id: int,
    current_user: User = Depends(get_current_user)
) -> None:
    deleted = await favorite_crud.remove_by_user_and_product(
        user_id=current_user.id,
        product_id=product_id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Product not found'
        )

    return None


# Проверка наличия товара в избранном
@router.get('/check')
async def check_in_favorites(
    product_id: int = Query(..., ge=1),
    current_user: User = Depends(get_current_user)
) -> SFavoriteCheckResponse:
    fav = await favorite_crud.get_by_user_and_product(
        user_id=current_user.id,
        product_id=product_id
    )

    return SFavoriteCheckResponse(in_favorites=bool(fav))