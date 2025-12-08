
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class DealMetrics(BaseModel):
    """Deal metrics data"""
    revenue: float = Field(default=0, ge=0)
    arr: Optional[float] = None
    mrr: Optional[float] = None
    growth_rate_mom: float = 0
    growth_rate_yoy: float = 0
    burn_rate: float = Field(default=0, ge=0)
    runway_months: float = Field(default=0, ge=0)
    gross_margin: Optional[float] = None
    customer_count: Optional[int] = None

class DealData(BaseModel):
    """Input data for deal scoring"""
    name: str
    description: str
    sector: List[str]
    stage: str
    metrics: DealMetrics
    team_size: int = Field(ge=1)
    founded_date: str
    location: Dict[str, str]

class ScoringWeights(BaseModel):
    """Custom scoring weights"""
    market_weight: float = Field(default=0.30, ge=0, le=1)
    traction_weight: float = Field(default=0.25, ge=0, le=1)
    team_weight: float = Field(default=0.25, ge=0, le=1)
    financial_weight: float = Field(default=0.20, ge=0, le=1)

class ScoreRequest(BaseModel):
    """Request for scoring a deal"""
    deal_data: DealData
    custom_weights: Optional[ScoringWeights] = None

class ScoreBreakdown(BaseModel):
    """Score breakdown by category"""
    market_score: float = Field(ge=0, le=100)
    traction_score: float = Field(ge=0, le=100)
    team_score: float = Field(ge=0, le=100)
    financial_score: float = Field(ge=0, le=100)
    product_score: Optional[float] = None
    competitive_score: Optional[float] = None

class DetailedAnalysis(BaseModel):
    """Detailed investment analysis"""
    market_size_estimate: Optional[float] = None
    growth_potential: str
    risk_level: str
    recommendation: str
    strengths: List[str]
    weaknesses: List[str]
    key_risks: List[str]
    opportunities: List[str]

class ScoreResponse(BaseModel):
    """Response with investment score"""
    investment_fit_score: float = Field(ge=0, le=100)
    breakdown: ScoreBreakdown
    detailed_analysis: DetailedAnalysis
    confidence: float = Field(ge=0, le=1)
    ml_model_version: str
