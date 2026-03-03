from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

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
async def profile_page(
    request: Request
):
    return templates.TemplateResponse(name="profile.html", context={"request" : request})

