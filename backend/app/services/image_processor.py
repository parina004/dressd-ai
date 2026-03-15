from backend.app.models.clothing_item import (CategoryEnum,SubtypeEnum,ColourEnum)

# Map messy words to enums
COLOUR_MAP = {
    "black": ColourEnum.black,
    "white": ColourEnum.white,
    "navy": ColourEnum.blue,
    "blue": ColourEnum.blue,
    "sky blue": ColourEnum.blue,
    "red": ColourEnum.red,
    "maroon": ColourEnum.red,
    "green": ColourEnum.green,
    "olive": ColourEnum.green,
    "brown": ColourEnum.brown,
    "beige": ColourEnum.beige,
    "pink": ColourEnum.pink,
    "purple": ColourEnum.purple,
    "yellow": ColourEnum.yellow,
    "orange": ColourEnum.orange,
    "gray": ColourEnum.gray,
    "grey": ColourEnum.gray,
}

SUBTYPE_MAP = {
    "shirt": SubtypeEnum.shirt,
    "tshirt": SubtypeEnum.tshirt,
    "t-shirt": SubtypeEnum.tshirt,
    "skirt": SubtypeEnum.skirt,
    "hoodie": SubtypeEnum.hoodie,
    "sneakers": SubtypeEnum.sneakers,
}

#can add more mappings as needed

def map_text_to_structured_data(text: str) -> dict:
    text = text.lower()

    words = text.split()

    category = None
    subtype = None
    colour = None
    tags = []

    # Detect color
    for key, value in COLOUR_MAP.items():
        if key in text:
            colour = value
            break

    # Detect subtype
    for key, value in SUBTYPE_MAP.items():
        if key in text:
            subtype = value
            break

    # Infer category from subtype
    if subtype:
        if subtype in [
            SubtypeEnum.shirt,
            SubtypeEnum.tshirt,
            SubtypeEnum.hoodie,
        ]:
            category = CategoryEnum.top

        elif subtype in [
            SubtypeEnum.skirt,
        ]:
            category = CategoryEnum.bottom

        elif subtype in [
            SubtypeEnum.sneakers,
        ]:
            category = CategoryEnum.footwear

    # Everything else becomes tags
    for word in words:
        if (
            word not in COLOUR_MAP
            and word not in SUBTYPE_MAP
        ):
            tags.append(word)

    return {
        "category": category,
        "subtype": subtype,
        "colour": colour,
        "tags": tags
    }
