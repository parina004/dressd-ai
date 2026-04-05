import os
import requests
import base64
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[3] / ".env")

hf_token = os.getenv("HF_TOKEN")
model_url = "https://router.huggingface.co/hf-inference/models/openai/clip-vit-base-patch32"

headers = {"Authorization": f"Bearer {hf_token}"}

def analyze_image(image_path):
    import json
    content = open(image_path,"rb").read()
    #to send binary image data as plain text inside the json request body 
    encoded_img = base64.b64encode(content).decode("utf-8")

    colour_labels = ["black", "white", "gray", "blue", "red", "green", "yellow", "brown", "beige", "pink", "purple", "orange"]
    subtype_labels = ["shirt", "tshirt", "croptop", "hoodie", "kurti", "skirt", "pants", "leggings", "plazos","shorts", "mini_dress", "midi_dress", "maxi_dress", "heels", "boots", "sneakers", "sandals", "handbag", "belt"] 
    pattern_labels = ["plain","striped","checked","floral","printed","graphic","denim","textured"]
    style_labels = ["casual", "formal", "sporty", "streetwear", "party", "ethnic", "lounge"] 
    length_labels = ["cropped", "short", "long", "knee_length", "full_length"]

    label_list = [colour_labels,subtype_labels,pattern_labels,style_labels,length_labels]
    response_list = []

    for label in label_list:
        payload = {
            "inputs" : encoded_img,
            "parameters" : {
                "candidate_labels":label
            }
        }
        response = requests.post(model_url, headers=headers, json=payload)
        print(response.status_code)
        print(response.text)

    #     response_list.append(result[0])
    #     print("\n")
    
    # print("response_list: ",response_list)
    # print("\n")

    # response_dict = {"colour":response_list[0]}
    # print("response_dict:", response_dict)

if __name__ == "__main__":
    import json
    output = analyze_image("data/images/blackSkirt.jpg")
    print(json.dumps(output, indent=2))