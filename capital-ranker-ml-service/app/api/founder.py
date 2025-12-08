
from fastapi import APIRouter, HTTPException
from app.schemas.founder_schema import (
    FounderEvaluationRequest, 
    FounderEvaluationResponse
)
from app.models.founder_evaluator import FounderEvaluator
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger()
founder_evaluator = FounderEvaluator()

@router.post("/evaluate_founder", response_model=FounderEvaluationResponse)
async def evaluate_founder(request: FounderEvaluationRequest):
    """
    Evaluate founder profile
    
    Args:
        request: Founder profile data
        
    Returns:
        Founder score with breakdown and red flags
    """
    try:
        logger.info("Evaluating founder")
        
        # Evaluate founder
        result = founder_evaluator.evaluate(request.founder_data)
        
        logger.info(f"Founder evaluated: {result.founder_score.overall_score}")
        return result
        
    except Exception as e:
        logger.error(f"Error evaluating founder: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
