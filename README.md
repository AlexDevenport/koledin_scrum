GaZaKoSaSuTu

Установка зависимостей:
pip install -r .\requirements.txt

Миграции:
alembic init app/migrations
alembic revision --autogenerate -m <name>
alembic upgrade head
alembic upgrade <num>
alembic downgrade
alembic downgrade <num>