from fastapi import APIRouter, Depends, HTTPException
from backend.app.api.deps import get_db
from backend.app.db import crud #cuz all functions
from backend.app.db.schemas import ClothingItemCreate, ClothingItemResponse
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/items",response_model = ClothingItemResponse)
def create_clothing_item(
    item: ClothingItemCreate,
    db: Session = Depends(get_db)
):
    return crud.create_item(db,item)

@router.get("/items",response_model=list[ClothingItemResponse])
def get_clothing_items(
    db: Session = Depends(get_db)
):
    return crud.get_all_items(db)

@router.get("/items/{item_id}",response_model=ClothingItemResponse)
def get_clothing_item_by_id(
    item_id: int,
    db: Session = Depends(get_db)  
):
    result = crud.get_item_by_id(db,item_id)
    if result == None:
        raise HTTPException(status_code = 404, detail = "Item not found")
    else:
        return result
    
@router.delete("/items/{item_id}",response_model=ClothingItemResponse)
def delete_clothing_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    result = crud.delete_item(db,item_id)
    if result == None:
        raise HTTPException(status_code = 404, detail = "Item not found")
    else:
        return result