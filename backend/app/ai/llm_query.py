import os
import ast
import json
from groq import Groq
from dotenv import load_dotenv
from backend.app.models.clothing_item import ColourEnum,StyleEnum,CategoryEnum,SubtypeEnum,LengthEnum,PatternEnum

category_labels = [e.value for e in CategoryEnum]
colour_labels = [e.value for e in ColourEnum]
subtype_labels = [e.value for e in SubtypeEnum]
pattern_labels =  [e.value for e in PatternEnum]
style_labels =  [e.value for e in StyleEnum]
length_labels =  [e.value for e in LengthEnum]

field_validators = {                                                      
    "category": category_labels,                                         
    "colour": colour_labels,
    "subtype": subtype_labels,
    "pattern": pattern_labels,
    "style": style_labels,                                                
    "length": length_labels
  }

output_schema = {
    "category":"value",
    "colour":"value",
    "subtype":"value",
    "pattern":"value",
    "style":"value",
    "length":"value"
}

prompt = f"""
You are a fashion assistant. Your job is to carefully analyze the user prompt and extract the following tags from the data.
Here are the label lists for each attribute that you can return values from:
category_labels = {category_labels}
colour_labels = {colour_labels}
subtype_labels = {subtype_labels}
pattern_labels = {pattern_labels}
style_labels =  {style_labels}
length_labels =  {length_labels}

Output format to be returned: 
{output_schema}

There can be multiple values from the possible combinations for each attribute. In that case, return it a a list with possible values.
Important:
- Not all attributes might be available in the user query. 
- Do NOT assume anything unless it can be logically derived from the data. 
- Use the label lists provided to get the proper values.
- If something is not available or you are unsure, leave the field blank.
- Return ONLY the final output in JSON format based on the schema given. NO EXTRA TEXT.

Think about what a user sentence actually tells you. Here are two examples
User sentence: "I want a smart casual outfit for a dinner date"
  - style → casual 
  - category → top + bottom (they said "outfit") 
  - colour → not mentioned, skip 
  - pattern → not mentioned, skip 
  - length → not mentioned, skip 

User sentence: "I want an all black floral dress for a party"
  - style → party 
  - category → dress 
  - colour → black 
  - pattern → floral 
  - length → not mentioned, skip 
"""

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def parse_outfit_request(usertext):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role":"user","content":prompt + "\n\nUser request: " + usertext}],
        max_tokens=500
    )

    result_text = response.choices[0].message.content
    text = result_text.strip()
    if text.startswith("```"):
        text = text.split("```")[1] #to get content between the backticks
        if text.startswith("json"):
            text = text[4:]         #removing j-s-o-n so skipping those and taking 4th character onwards
    
    result = ast.literal_eval(text.strip())
    
    for field, valid_values in field_validators.items():
        if field in result:
            value = result[field]
            if isinstance(value, list):
                result[field] = [v for v in value if v in valid_values]   
            elif isinstance(value, str):
                if value not in valid_values:
                    result[field] = None

    return result

if __name__ == "__main__":
    print(parse_outfit_request("I want a casual black outfit for a dinner date"))
    print(parse_outfit_request("I want a nice short one-piece for amusement park"))
