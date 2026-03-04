import asyncio
from datetime import datetime
import json
import pytest
from sqlalchemy import insert

from app.config import settings
from app.database import Base, async_session_maker, engine
from app.favorites.models import Favorite
from app.orders.models import Order, OrderItem
from app.products.models import Product
from app.users.models import User


# Фикстура для настройки тестовой БД
@pytest.fixture(scope='session', autouse=True)
async def prepare_database():
    assert settings.MODE == 'TEST'

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    def open_mock_json(model: str):
        with open(f'app/tests/mock_{model}.json', encoding='utf-8') as file:
            return json.load(file)

    favorites = open_mock_json('favorites')
    orders = open_mock_json('orders')
    order_items = open_mock_json('order_items')
    products = open_mock_json('products')
    users = open_mock_json('users')

    # Преобразуем в понятную для алхимии дату
    for order in orders:
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    for user in users:
        user['created_at'] = datetime.fromisoformat(user['created_at'])

    async with async_session_maker() as session:
        add_favorites = insert(Favorite).values(favorites)
        add_orders = insert(Order).values(orders)
        add_order_items = insert(OrderItem).values(order_items)
        add_products = insert(Product).values(products)
        add_users = insert(User).values(users)

        await session.execute(insert(User).values(users))
        await session.execute(insert(Product).values(products))
        await session.execute(insert(Order).values(orders))
        await session.execute(insert(OrderItem).values(order_items))
        await session.execute(insert(Favorite).values(favorites))
        
        await session.commit()


# Из официальной документации pytest-asyncio
@pytest.fixture(scope='session')
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()