from backend.app.db.database import engine, Base
from backend.app.models.clothing_item import ClothingItem

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Table created")



