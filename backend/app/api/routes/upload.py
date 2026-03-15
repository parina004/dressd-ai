from fastapi import APIRouter, UploadFile, File
from backend.app.services.image_storage import save_image

router = APIRouter()

@router.post("/upload")
def upload_image_file(
    file: UploadFile = File(...)
):
    path = save_image(file)
    return {"image_path": path}