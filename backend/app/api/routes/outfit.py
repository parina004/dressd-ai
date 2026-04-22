from fastapi import APIRouter, Depends
from backend.app.ai.llm_query import parse_outfit_request
from backend.app.db import crud
from backend.app.api.deps import get_db
from backend.app.models.clothing_item import ClothingItem
from sqlalchemy.orm import Session

from pydantic import BaseModel

class OutfitRequest(BaseModel):
    query: str

router = APIRouter()

@router.post("/outfit")
def fetch_outfit(
    request: OutfitRequest,
    db: Session = Depends(get_db)
):
    tag_vocab = crud.get_all_tags(db)
    print(f"\n--- OUTFIT REQUEST ---")
    print(f"Query: {request.query}")
    print(f"Tag vocab sent to LLM: {tag_vocab}")

    llm_response = parse_outfit_request(request.query, tag_vocab)
    print(f"LLM response: {llm_response}")

    requested_category = llm_response.get("category")
    wants_dress = (
        requested_category == "dress" or
        (isinstance(requested_category, list) and
         "dress" in requested_category and
         "top" not in requested_category and
         "bottom" not in requested_category)
    )
    print(f"Wants dress: {wants_dress}")

    candidates = crud.get_outfit_items(db, llm_response)

    # apply per-category colour filter
    colour_by_category = llm_response.get("colour_by_category", {})

    def colour_matches(item):
        cat = item.category.value
        required_colour = colour_by_category.get(cat)
        if required_colour is None:
            return True
        return item.colour.value == required_colour

    if colour_by_category:
        candidates = [item for item in candidates if colour_matches(item)]

    print(f"Candidates after colour filter: {[(i.id, i.category, i.colour, i.tags) for i in candidates]}")

    matched_tags = llm_response.get("matched_tags", [])
    print(f"Matched tags used for scoring: {matched_tags}")

    def score(item):
        return sum(1 for tag in matched_tags if tag in (item.tags or []))

    candidates_sorted = sorted(candidates, key=score, reverse=True)
    print(f"Candidates after scoring: {[(i.id, i.category, score(i)) for i in candidates_sorted]}")

    if wants_dress:
        dress = next((item for item in candidates_sorted if item.category == "dress"), None)
        return [dress] if dress else []

    top = next((item for item in candidates_sorted if item.category == "top"), None)
    bottom = next((item for item in candidates_sorted if item.category == "bottom"), None)

    # fallback: respect exclude tags and explicit colour constraints
    exclude_tags = llm_response.get("exclude", [])

    if top is None:
        top_colour = colour_by_category.get("top")
        top_query = db.query(ClothingItem).filter(ClothingItem.category == "top")
        if top_colour:
            top_query = top_query.filter(ClothingItem.colour == top_colour)
        all_tops = top_query.all()
        if exclude_tags:
            all_tops = [t for t in all_tops if not any(tag in (t.tags or []) for tag in exclude_tags)]
        top = all_tops[0] if all_tops else None

    if bottom is None:
        bottom_colour = colour_by_category.get("bottom")
        bottom_query = db.query(ClothingItem).filter(ClothingItem.category == "bottom")
        if bottom_colour:
            bottom_query = bottom_query.filter(ClothingItem.colour == bottom_colour)
        all_bottoms = bottom_query.all()
        if exclude_tags:
            all_bottoms = [b for b in all_bottoms if not any(tag in (b.tags or []) for tag in exclude_tags)]
        bottom = all_bottoms[0] if all_bottoms else None

    print(f"Final: top={top and top.id}, bottom={bottom and bottom.id}")
    return [item for item in [top, bottom] if item is not None]
