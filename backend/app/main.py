from backend.app.db.database import engine, Base
from backend.app.models.clothing_item import ClothingItem
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import clothing,upload,outfit
from fastapi.staticfiles import StaticFiles

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Table created")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def start():
    create_tables()
    print("Database is ready!")

@app.get("/")
def test():
    return {"message":"dressd-ai server is running"}

#including routers from routes folder
app.include_router(clothing.router)
app.include_router(upload.router)
app.include_router(outfit.router)

app.mount("/data",StaticFiles(directory="data"),name="data")