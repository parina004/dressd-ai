from backend.app.db.init_db import create_tables

def start():
    create_tables()
    print("Database is ready!")

if __name__== "__main__":
    start()