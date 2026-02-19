from app.BaseService import BaseService
from app.orders.models import Orders 

class OrdersService(BaseService):
    model = Orders
    