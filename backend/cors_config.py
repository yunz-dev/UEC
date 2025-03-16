from fastapi.middleware.cors import CORSMiddleware

def configure_cors(app):
    """Configure CORS for the FastAPI application."""
    
    origins = [
        "http://localhost:3000",  # React frontend
        "http://127.0.0.1:3000",
        # Add any other origins as needed
    ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    return app
