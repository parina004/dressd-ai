from fastapi import APIRouter,Depends
from backend.app.ai.llm_query import parse_outfit_request
from backend.app.db.crud import get_outfit_items
from backend.app.api.deps import get_db
from sqlalchemy.orm import Session

from pydantic import BaseModel

class OutfitRequest(BaseModel):
    query:str

router = APIRouter()

@router.post("/outfit")
def fetch_outfit(
    request: OutfitRequest,
    db: Session = Depends(get_db)
):
    llm_response = parse_outfit_request(request.query)
    outfit = get_outfit_items(db,llm_response)

    top = next((item for item in outfit if item.category == "top"),None)
    bottom = next((item for item in outfit if item.category == "bottom"),None)
    dress = next((item for item in outfit if item.category == "dress"),None)

    if dress is not None:
        return dress
    else:
        return [item for item in [top,bottom] if item is not None]