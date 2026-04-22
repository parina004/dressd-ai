from sqlalchemy import Column, Integer, String, JSON, Enum, DateTime
from backend.app.db.database import Base
import enum
from datetime import datetime,timezone

class CategoryEnum(str,enum.Enum):
    top = "top"
    bottom = "bottom"
    dress = "dress"
    accessory = "accessory"
    footwear = "footwear"

class ColourEnum(str, enum.Enum):
    black = "black"
    white = "white"
    gray = "gray"
    blue = "blue"
    red = "red"
    green = "green"
    yellow = "yellow"
    brown = "brown"
    beige = "beige"
    pink = "pink"
    purple = "purple"
    orange = "orange"

class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(Enum(CategoryEnum), nullable=False)
    colour = Column(Enum(ColourEnum), nullable=True)
    tags = Column(JSON, nullable=True)  # everything else: style, fit, pattern, length, occasion, etc.
    image_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
