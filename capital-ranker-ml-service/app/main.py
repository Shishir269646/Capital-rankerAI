# app/main.py
# FastAPI Application Entry Point

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime

# Import routers
from app.api import scoring, thesis, founder
from app.config.settings import settings
from app.utils.logger import setup_logger

# Initialize logger
logger = setup_logger()

# Create FastAPI app
app = FastAPI(
    title="Capital Ranker ML Service",
    description="AI/ML powered investment scoring and analysis",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(scoring.router, prefix="/api/v1", tags=["Scoring"])
app.include_router(thesis.router, prefix="/api/v1", tags=["Thesis"])
app.include_router(founder.router, prefix="/api/v1", tags=["Founder"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": "Capital Ranker ML Service",
            "version": "1.0.0",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint - API information
    """
    return {
        "message": "Capital Ranker ML Service",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "scoring": "/api/v1/score_deal",
            "thesis": "/api/v1/match_thesis",
            "founder": "/api/v1/evaluate_founder"
        }
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An error occurred"
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """
    Actions to perform on startup
    """
    logger.info("="*50)
    logger.info("Capital Ranker ML Service Starting...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    logger.info(f"Host: {settings.HOST}:{settings.PORT}")
    logger.info("="*50)

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Actions to perform on shutdown
    """
    logger.info("Capital Ranker ML Service Shutting Down...")

# Run the application (for development)
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )