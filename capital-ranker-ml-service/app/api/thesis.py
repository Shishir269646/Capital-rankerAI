
from fastapi import APIRouter, HTTPException
from app.schemas.thesis_schema import ThesisMatchRequest, ThesisMatchResponse
from app.services.nlp_service import NLPService
from app.utils.logger import setup_logger

router = APIRouter()
logger = setup_logger()
nlp_service = NLPService()

@router.post("/match_thesis", response_model=ThesisMatchResponse)
async def match_thesis(request: ThesisMatchRequest):
    """
    Match investor thesis with pitch deck
    
    Args:
        request: Pitch text and thesis text
        
    Returns:
        Relevancy score with matched keywords and sections
    """
    try:
        logger.info("Matching thesis with pitch")
        
        # Perform matching
        result = nlp_service.match_thesis(
            pitch_text=request.pitch_text,
            thesis_text=request.thesis_text
        )
        
        logger.info(f"Thesis matched: {result.relevancy_score}%")
        return result
        
    except Exception as e:
        logger.error(f"Error matching thesis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate_embedding")
async def generate_embedding(request: dict):
    """
    Generate text embedding for similarity search
    
    Args:
        request: {"text": "text to embed"}
        
    Returns:
        Embedding vector
    """
    try:
        text = request.get("text", "")
        if not text:
            raise ValueError("Text is required")
            
        embedding = nlp_service.generate_embedding(text)
        
        return {
            "embedding": embedding,
            "dimension": len(embedding)
        }
        
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
