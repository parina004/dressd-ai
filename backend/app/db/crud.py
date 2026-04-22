from backend.app.models.clothing_item import ClothingItem
from backend.app.db.schemas import ClothingItemCreate


def create_item(db, item):
    db_item = ClothingItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_all_items(db):
    return db.query(ClothingItem).all()

def get_item_by_id(db, item_id):
    result = db.query(ClothingItem).filter(ClothingItem.id == item_id).first()
    return result if result else None

def delete_item(db, item_id):
    item = get_item_by_id(db, item_id)
    if item:
        db.delete(item)
        db.commit()
        return item

def get_all_tags(db):
    items = db.query(ClothingItem).all()
    all_tags = set()
    for item in items:
        if item.tags:
            all_tags.update(item.tags)
    return sorted(list(all_tags))

def get_outfit_items(db, filters):
    query = db.query(ClothingItem)

    category = filters.get("category")
    exclude_tags = filters.get("exclude", [])

    if category is not None:
        if isinstance(category, list):
            query = query.filter(ClothingItem.category.in_(category))
        elif isinstance(category, str):
            query = query.filter(ClothingItem.category == category)

    results = query.all()

    # exclude is a hard constraint — always apply
    if exclude_tags:
        results = [item for item in results
                   if not any(tag in (item.tags or []) for tag in exclude_tags)]

    return results
