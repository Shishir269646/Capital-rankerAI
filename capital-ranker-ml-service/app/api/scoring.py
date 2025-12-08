# ============================================
# app/api/scoring.py
# Deal Scoring API Endpoint
# ============================================

from fastapi import APIRouter, HTTPException
from app.schemas.scoring_schema import ScoreRequest, ScoreResponse
from app.services.scoring_service import ScoringService
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger()
scoring_service = ScoringService()

@router.post("/score_deal", response_model=ScoreResponse)
async def score_deal(request: ScoreRequest):
    """
    Score a deal using ML model
    
    Args:
        request: Deal data and optional custom weights
        
    Returns:
        Investment fit score with detailed breakdown
    """
    try:
        logger.info(f"Scoring deal: {request.deal_data.name}")
        
        # Score the deal
        result = scoring_service.score_deal(
            deal_data=request.deal_data,
            custom_weights=request.custom_weights
        )
        
        logger.info(f"Deal scored successfully: {result.investment_fit_score}")
        return result
        
    except Exception as e:
        logger.error(f"Error scoring deal: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# app/api/thesis.py
# Thesis Matching API Endpoint
# ============================================

# ============================================
# app/api/founder.py
# Founder Evaluation API Endpoint
# ============================================

# ============================================
# app/api/__init__.py
# ============================================
