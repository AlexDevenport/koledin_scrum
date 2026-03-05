from sqlalchemy import JSON, Column, Float, Integer, String

from app.database import Base


class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String(length=100))
    price = Column(Integer)
    description = Column(String, nullable=True)

    # карточка товара
    category = Column(String(length=20), nullable=False)
    preview_image = Column(String, nullable=True) # главная картинка
    images = Column(JSON, nullable=True) # список доп. изображений или рендеров

    # характеристики
    polygons_count = Column(Integer, default=0, server_default='0')
    texture_quality = Column(String(20), nullable= True) # hd, full hd, 2K, 4K, ...
    formats = Column(JSON, nullable=True) # ["fbx", "obj", "blend", "stl"]

    # доп. сведения
    views_count = Column(Integer, default=0, server_default='0') # количество просмотров
    rating = Column(Float, default= 0.0, server_default='0.0') # рейтинг от 0 до 5