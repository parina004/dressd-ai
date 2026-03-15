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

class SubtypeEnum(str,enum.Enum):
    
    #tops
    shirt = "shirt"
    tshirt = "tshirt"
    croptop = "croptop"
    hoodie = "hoodie"
    kurti = "kurti"

    #bottoms
    skirt = "skirt"
    pants = "pants"
    leggings = "leggings"
    plazos = "plazos"
    shorts = "shorts"

    #dresses
    mini_dress = "mini_dress"
    midi_dress = "midi_dress"
    maxi_dress = "maxi_dress"

    #accessory
    handbag = "handbag"
    belt = "belt"

    #footwear
    heels = "heels"
    boots = "boots"
    sneakers = "sneakers"
    sandals = "sandals"

class ColourEnum(str, enum.Enum):
    
    #keeping base colours only that others will be mapped to
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

class PatternEnum(str, enum.Enum):
    plain = "plain"
    striped = "striped"
    checked = "checked"
    floral = "floral"
    printed = "printed"
    graphic = "graphic"
    denim = "denim"
    textured = "textured"

class StyleEnum(str, enum.Enum):
    casual = "casual"
    formal = "formal"
    sporty = "sporty"
    streetwear = "streetwear"
    party = "party"
    ethnic = "ethnic"
    lounge = "lounge"

class LengthEnum(str, enum.Enum):
    cropped = "cropped"
    short = "short"
    knee_length = "knee_length"
    midi = "midi"
    long = "long"
    full_length = "full_length"

class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(Integer, primary_key=True, index = True)
    category = Column(Enum(CategoryEnum),nullable=False)
    subtype = Column(Enum(SubtypeEnum),nullable = False)
    colour = Column(Enum(ColourEnum),nullable=True)
    pattern = Column(Enum(PatternEnum),nullable=True)
    style = Column(Enum(StyleEnum), nullable=True) 
    length = Column(Enum(LengthEnum),nullable=True)
    tags = Column(JSON,nullable=True)
    image_path = Column(String,nullable=False)
    created_at = Column(DateTime,default = datetime.now(timezone.utc))