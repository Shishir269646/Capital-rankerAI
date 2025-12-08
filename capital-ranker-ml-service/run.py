"""
Server startup script
Run this to start the ML service
"""

import uvicorn
from app.config.settings import settings

if __name__ == "__main__":
    print("="*60)
    print(f"🚀 Starting {settings.APP_NAME}")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🌐 Server: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 Docs: http://{settings.HOST}:{settings.PORT}/docs")
    print("="*60)
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,  # Auto-reload on code changes
        log_level=settings.LOG_LEVEL.lower()
    )
