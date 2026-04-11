# dressd.ai

Every girl knows the feeling. Staring at a full wardrobe and still feeling like you have nothing to wear. Sometimes you forget what you even own. Sometimes you know the vibe but can't pull the pieces together. dressd.ai is my answer to that.

It's an AI-powered wardrobe assistant. Upload your clothes once, then describe the outfit you want in plain English. "Casual dinner look, nothing too revealing" returns a matching combination from your actual wardrobe, not a generic suggestion.

## Key Features

- **Natural Language Search** - A plain English query is parsed by an LLM into structured filters: category, colour, and style attributes to match. No keywords, no dropdowns, just describe what you want.

- **Inclusion and Exclusion** - The query handles both sides. "Nothing blue" and "no sleeveless" filter out unwanted attributes just as naturally as specifying what you do want.

- **Outfit Composition** - Filtered results are assembled into a complete look: a top and bottom pair, or a dress when that fits the query better.

- **Smart Attribute Schema** - Clothing attributes are stored as a hybrid: strict enums for category and colour so filtering is consistent and reliable, and a free-form tags array for everything else: fit, occasion, pattern, silhouette, length, sleeve type. This gives the LLM room to be expressive while keeping structured fields queryable.

- **Wardrobe Management API** - REST endpoints built with FastAPI for adding, viewing, and removing clothing items.

- **Image Upload** - Each item is stored with a photo linked to its database record.

## Why I Built It

This started as a personal problem. I wanted something that actually knew my wardrobe and could think in the same language I use when getting dressed, not a filter panel or a dropdown menu.

The interesting part was figuring out how to make an LLM a useful fashion assistant when it can't see your clothes. How do you translate something as visual and subjective as style into a form it can reason about? The answer to that question shaped most of the design decisions in this project.

## Planned

- A frontend with a wardrobe grid, upload flow, and natural language search
- Outfit scoring based on how many tags match the query, so better matches rank higher instead of returning the first result
- Colour precision: currently all colours map to base values (blue, red, green). Extending this to shades and tones so light blue and navy blue are treated as distinct and matched accordingly
- Computer vision to auto-tag uploaded items directly from the photo
- Multimodal search: upload an inspiration photo and find pieces in your wardrobe that match the vibe
