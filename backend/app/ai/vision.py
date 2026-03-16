import os
import requests
import base64
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[3] / ".env")

vision_api = os.getenv("GOOGLE_VISION_API")
print(vision_api)
print("*****************************************")

def analyze_image(image_path):
    content = open(image_path,"rb").read()

    #to send binary image data as plain text inside the json request body 
    encoded = base64.b64encode(content).decode("utf-8")

    url = f"https://vision.googleapis.com/v1/images:annotate?key={vision_api}"

    body = {
    "requests": [
      {
        "image": { "content": encoded },
        "features": [
          {"type": "LABEL_DETECTION", "maxResults": 10},
          {"type": "IMAGE_PROPERTIES"}
        ]
      }
    ]
  }

    response = requests.post(url, json=body)
    result = response.json()

    return result

if __name__ == "__main__":
    import json
    output = analyze_image("data/images/blackSkirt.jpg")
    print(json.dumps(output, indent=2))