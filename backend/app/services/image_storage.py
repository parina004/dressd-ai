import uuid
import os
from pathlib import Path

def save_image(file):
    base = str(uuid.uuid4()) 
    extension = os.path.splitext(file.filename)[1]
    filename = base + extension

    #creating the filepath
    save_path = Path("data/images") / filename
    
    output = file.file.read()
 
    #actually saving (here, writing) the image (bytes cuz wb) to that path  
    with open(save_path,"wb") as f:
            f.write(output)

    return str(save_path)

