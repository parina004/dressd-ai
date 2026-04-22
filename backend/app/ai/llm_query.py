import os
import ast
from groq import Groq
from dotenv import load_dotenv
from backend.app.models.clothing_item import CategoryEnum, ColourEnum

category_labels = [e.value for e in CategoryEnum]
colour_labels = [e.value for e in ColourEnum]

field_validators = {
    "category": category_labels,
}

base_prompt = f"""
You are a fashion assistant. Analyze the user's outfit request and extract structured attributes.

Controlled fields — only use values from these lists:
category_labels = {category_labels}
colour_labels = {colour_labels}

Fields to extract:

- category: which type(s) of clothing the user wants. Use category_labels only.

- colour_by_category: ONLY populate this if the user explicitly mentioned a colour for a specific piece.
  Format as a dict mapping category to colour. Use colour_labels only for colour values.
  If the user did not mention a colour, leave this as an empty dict.
  Examples:
    "blue jeans" → {{"bottom": "blue"}}
    "white top and blue jeans" → {{"top": "white", "bottom": "blue"}}
    "a casual outfit" → {{}}
    "formal lunch outfit" → {{}}  ← do NOT infer colours

- tags: generate descriptive fashion tags freely — include style (casual, formal, party, ethnic, sporty, lounge, streetwear),
  fit (fitted, oversized, relaxed, bodycon), occasion (dinner, work, beach, gym, date),
  silhouette, pattern (plain, floral, striped, checked, graphic, denim, printed, textured),
  length (cropped, short, knee_length, midi, long, full_length),
  sleeve type (sleeveless, short_sleeve, long_sleeve), fabric feel, or any other relevant descriptor.
  Be generous with tags — more is better than less.

- exclude: list anything the user wants to avoid (colours, styles, fits, garment types, etc.)

Rules:
- category must only use values from category_labels
- colour_by_category values must only use values from colour_labels
- tags and exclude are free-form
- Multiple values for category should be a list
- Only include fields you are confident about — omit if unsure
- Return ONLY valid JSON. NO extra text, NO markdown.

Examples:
User: "I want a smart casual outfit for a dinner date"
→ {{"category": ["top", "bottom"], "colour_by_category": {{}}, "tags": ["casual", "smart casual", "dinner", "date", "elegant"], "exclude": []}}

User: "Give me a short floral dress for a beach day, nothing too revealing"
→ {{"category": "dress", "colour_by_category": {{}}, "tags": ["short", "floral", "beach", "summer", "printed"], "exclude": ["bodycon", "mini", "revealing"]}}

User: "A white top and blue jeans, no pink"
→ {{"category": ["top", "bottom"], "colour_by_category": {{"top": "white", "bottom": "blue"}}, "tags": ["jeans", "denim", "casual"], "exclude": ["pink"]}}
"""

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def parse_outfit_request(usertext, tag_vocab=None):
    prompt = base_prompt

    if tag_vocab:
        prompt += f"""
This wardrobe's tag vocabulary (tags that actually exist on items in this wardrobe):
{tag_vocab}

Additional field to include in output:
- matched_tags: CRITICAL RULE — this list must ONLY contain words copied exactly from the vocabulary above.
  Do NOT invent new words. Do NOT paraphrase. Do NOT include synonyms.
  Look at your generated tags, find which ones appear word-for-word in the vocabulary, return only those.
  If nothing matches exactly, return an empty list.

Updated output format:
{{
  "category": "...",
  "colour_by_category": {{}},
  "tags": ["your freely generated tags"],
  "matched_tags": ["only exact words from the vocabulary above"],
  "exclude": ["..."]
}}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt + "\n\nUser request: " + usertext}],
        max_tokens=500
    )

    result_text = response.choices[0].message.content
    text = result_text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    result = ast.literal_eval(text.strip())

    # validate category
    if "category" in result:
        value = result["category"]
        if isinstance(value, list):
            result["category"] = [v for v in value if v in category_labels]
        elif isinstance(value, str):
            if value not in category_labels:
                result["category"] = None

    # validate colour_by_category — keys must be valid categories, values must be valid colours
    colour_by_cat = result.get("colour_by_category", {})
    if colour_by_cat:
        result["colour_by_category"] = {
            cat: col for cat, col in colour_by_cat.items()
            if cat in category_labels and col in colour_labels
        }

    return result

if __name__ == "__main__":
    print(parse_outfit_request("I want a casual black outfit for a dinner date"))
    print(parse_outfit_request("I want a nice short one-piece for amusement park"))
    print(parse_outfit_request("Give me a white top and blue jeans combo, nothing pink"))
