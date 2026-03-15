from pydantic import BaseModel
from typing import List,Optional
from datetime import datetime
class ClothingItemBase(BaseModel):
    category:str
    subtype:Optional[str] = None
    colour:Optional[str] = None
    pattern:Optional[str] = None
    style:Optional[str] = None
    length:Optional[str] = None
    tags:Optional[List[str]] = []
    image_path:str

#used while creating a new clothing item
class ClothingItemCreate(ClothingItemBase):
    pass

#used when returning clothing items to frontend
class ClothingItemResponse(ClothingItemBase):
    id:int
    created_at: datetime
    class Config:
        orm_mode=True