# ============================================
# app/config/settings.py
# Environment Configuration
# ============================================

from typing import List

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    # Application
    APP_NAME: str = "Capital Ranker ML Service"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS_STR: str = Field(
        "http://localhost:3000,http://localhost:5000",
        alias='ALLOWED_ORIGINS'
    )

    @computed_field
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS_STR, str):
            return [origin.strip() for origin in self.ALLOWED_ORIGINS_STR.split(',')]
        return []
    
    # Model Configuration
    ML_MODEL_VERSION: str = "v1.0.0"
    MODEL_PATH: str = "models_storage/"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# ============================================
# app/config/__init__.py
# ============================================



# ============================================
# app/utils/logger.py
# Logging Configuration
# ============================================


# ============================================
# app/schemas/scoring_schema.py
# Pydantic Schemas for Scoring
# ============================================

# ============================================
# app/schemas/thesis_schema.py
# Pydantic Schemas for Thesis Matching
# ============================================

# ============================================
# app/schemas/founder_schema.py
# Pydantic Schemas for Founder Evaluation
# ============================================


# ============================================
# app/schemas/__init__.py
# ============================================
