from typing import List
from pydantic import BaseModel, Field

class ThesisMatchRequest(BaseModel):
    """Request for thesis matching"""
    pitch_text: str = Field(min_length=50)
    thesis_text: str = Field(min_length=50)

class SimilarityBreakdown(BaseModel):
    """Similarity breakdown"""
    sector_match: float = Field(ge=0, le=100)
    stage_match: float = Field(ge=0, le=100)
    semantic_similarity: float = Field(ge=0, le=100)

class MatchedSection(BaseModel):
    """Matched text sections"""
    thesis_section: str
    pitch_section: str
    similarity: float

class ThesisMatchResponse(BaseModel):
    """Response with thesis match results"""
    relevancy_score: float = Field(ge=0, le=100)
    matched_keywords: List[str]
    similarity_breakdown: SimilarityBreakdown
    matched_sections: List[MatchedSection]
