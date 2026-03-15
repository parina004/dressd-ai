from backend.app.db.database import SessionLocal
from backend.app.models.clothing_item import ClothingItem

db = SessionLocal()

item = ClothingItem(
    category = "bottom",
    subtype = "skirt",
    colour = "black",
    pattern = "plain",
    style = "denim",
    length = "knee_length",
    tags =["cotton","casual"],
    image_path = "data/images/blackSkirt.jpg"
)

db.add(item)
db.commit()

print("Item added to database!")
print("ID:",item.id)