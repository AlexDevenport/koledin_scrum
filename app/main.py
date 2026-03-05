from fastapi import FastAPI
from pathlib import Path
from sqlalchemy import text
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.database import async_session_maker
from app.favorites.router import router as favorites_router
from app.orders.router import router as orders_router
from app.products.router import router as products_router
from app.users.router import router as users_router
from app.pages.router import router as pages_router


app = FastAPI()


app.include_router(products_router)
app.include_router(users_router)
app.include_router(favorites_router)
app.include_router(orders_router)
app.include_router(pages_router)


app.mount('/static', StaticFiles(directory='app/frontend/static'), 'static')


origins = ['*',]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH', 'PUT'],
    allow_headers=['Content-Type', 'Set-Cookie', 'Access-Control-Allow-Headers', 
                   'Access-Control-Allow-Origin', 'Authorization'],
)


# Временная ручка обновления бд
@app.post('/refresh_db/')
async def refresh_db():
    base_dir = Path(__file__).resolve().parent.parent # koledin_scrum
    sql_path = base_dir / 'data_for_postgre.sql'
    sql_script = sql_path.read_text(encoding='utf-8')
    async with async_session_maker() as session:
        async with session.begin():
            commands = sql_script.split(";")
            for command in commands:
                command = command.strip()
                if command:
                    await session.execute(text(command))

    return {'message': 'Database refreshed successfully'}