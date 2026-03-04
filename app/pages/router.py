from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates

from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(
    tags= ["Фронтенд"]
)

templates = Jinja2Templates(directory="app/frontend/templates")

@router.get("/")
async def main_page(
    request: Request
):
    return templates.TemplateResponse(name="index.html", context={"request" : request})

@router.get("/cart")
async def cart_page(
    request: Request
):
    return templates.TemplateResponse(name="cart.html", context={"request" : request})

@router.get("/catalog")
async def catalog_page(
    request: Request
):
    return templates.TemplateResponse(name="catalog.html", context={"request" : request})

@router.get("/login")
async def login_page(
    request: Request
):
    return templates.TemplateResponse(name="login.html", context={"request" : request})

@router.get("/product")
async def product_page(
    request: Request
):
    return templates.TemplateResponse(name="product.html", context={"request" : request})

@router.get("/profile")
async def profile(
    request: Request,
    user: User = Depends(get_current_user)
):
    return templates.TemplateResponse(
        "profile.html",
        {
            "request": request,
            "user": user
        }
    )

