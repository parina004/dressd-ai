from backend.app.models.clothing_item import ClothingItem
from backend.app.db.schemas import ClothingItemCreate


def create_item(db,item):
    db_item = ClothingItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_all_items(db):
    result = db.query(ClothingItem).all()
    return result

def get_item_by_id(db,item_id):
    result = db.query(ClothingItem).filter(ClothingItem.id == item_id).first()
    if result:
        return result
    else:
        return None
    
def delete_item(db,item_id):
    item = get_item_by_id(db,item_id)
    if item:
        db.delete(item)
        db.commit()
        return item
    
def get_outfit_items(db,filters):
    query = db.query(ClothingItem)

    for field,value in filters.items():
        if value is not None:
            if isinstance(value, list):
                query = query.filter(getattr(ClothingItem,field).in_(value))
            if isinstance(value,str):
                query = query.filter(getattr(ClothingItem,field) == value)

    return query.all()