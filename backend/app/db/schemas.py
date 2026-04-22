from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ClothingItemBase(BaseModel):
    category: str
    colour: Optional[str] = None
    tags: Optional[List[str]] = []
    image_path: str

class ClothingItemCreate(ClothingItemBase):
    pass

class ClothingItemResponse(ClothingItemBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
