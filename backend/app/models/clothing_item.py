from sqlalchemy import Column, Integer, String, JSON
from backend.app.db.database import Base

class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id = Column(Integer, primary_key=True, index = True)
    category = Column(String,nullable=False)
    subtype = Column(String,nullable = False)
    color = Column(String,nullable=True)
    pattern = Column(String,nullable=True)
    style = Column(String, nullable=True)
    length = Column(String,nullable=True)
    tags = Column(JSON,nullable=True)
    image_path = Column(String,nullable=False)
