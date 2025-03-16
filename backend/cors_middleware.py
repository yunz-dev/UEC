from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def add_cors_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "https://localhost:3000", "*"],  # Add your frontend origin(s)
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
