# dressd.ai

Every girl knows the feeling. Staring at a full wardrobe and still feeling like you have nothing to wear. Sometimes you forget what you even own. Sometimes you know the vibe but can't pull the pieces together. dressd.ai is my answer to that.

It's an AI-powered wardrobe assistant. Upload your clothes once, then describe the outfit you want in plain English. "Casual dinner look, nothing too revealing" returns a matching combination from your actual wardrobe, not a generic suggestion.

## Features

- **Natural Language Search** - Describe what you want in plain English and the LLM translates it into filters. Both sides work: "casual dinner look" finds the right pieces, "nothing blue, no sleeveless" filters them out. No keywords, no dropdowns.

- **Outfit Composition** - Results are assembled into a complete look. A top and bottom pair, or a dress when the query calls for it. The best-matching item fills each slot, scored by how many of its style tags align with the query.

- **Image Upload** - Each clothing item is stored with a photo you upload. The app works from your actual wardrobe, not generic suggestions.

- **Scored Selection** - Every candidate is ranked by how closely its tags match the query. The highest-scoring piece wins each slot, so you always get the most relevant combination, not just the first match found.

## Why I Built It

This started as a personal problem. I wanted something that actually knew my wardrobe and could think in the same language I use when getting dressed, not a filter panel or a dropdown menu.

The interesting part was figuring out how to make an LLM a useful fashion assistant when it can't see your clothes. How do you translate something as visual and subjective as style into a form it can reason about? The answer to that question shaped most of the design decisions in this project.

## Tech Stack

Next.js · FastAPI · SQLite · Groq  · Framer Motion

## Running Locally

**Backend**

```bash
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

Runs at `http://localhost:8000`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000`

> Deployment in progress... hosted version coming soon.

## Potential Extensions

- Colour precision: currently all colours map to base values (blue, red, green). Extending this to shades and tones so light blue and navy blue are treated as distinct and matched accordingly
- Computer vision to auto-tag uploaded items directly from the photo
- Multimodal search: upload an inspiration photo and find pieces in your wardrobe that match the vibe
