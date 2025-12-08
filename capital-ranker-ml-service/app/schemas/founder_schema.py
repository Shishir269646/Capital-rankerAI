from typing import List, Optional
from pydantic import BaseModel, Field

class Education(BaseModel):
    """Founder education"""
    institution: str
    degree: str
    field_of_study: str
    graduated: bool

class Experience(BaseModel):
    """Founder experience"""
    company: str
    title: str
    duration_years: float
    achievements: List[str] = []

class PreviousStartup(BaseModel):
    """Previous startup experience"""
    name: str
    role: str
    outcome: str
    exit_value: Optional[float] = None

class Skills(BaseModel):
    """Founder skills"""
    technical_skills: List[str] = []
    domain_expertise: List[str] = []
    leadership_experience: bool = False
    years_of_experience: float = 0

class FounderData(BaseModel):
    """Founder profile data"""
    education: List[Education] = []
    experience: List[Experience] = []
    previous_startups: List[PreviousStartup] = []
    skills: Skills
    achievements: List[str] = []

class FounderEvaluationRequest(BaseModel):
    """Request for founder evaluation"""
    founder_data: FounderData

class FounderScoreBreakdown(BaseModel):
    """Founder score breakdown"""
    overall_score: float = Field(ge=0, le=100)
    experience_score: float = Field(ge=0, le=100)
    education_score: float = Field(ge=0, le=100)
    track_record_score: float = Field(ge=0, le=100)
    leadership_score: float = Field(ge=0, le=100)
    adaptability_score: float = Field(ge=0, le=100)
    domain_expertise_score: float = Field(ge=0, le=100)

class RedFlag(BaseModel):
    """Red flag detected"""
    type: str
    description: str
    severity: str

class FounderEvaluationResponse(BaseModel):
    """Response with founder evaluation"""
    founder_score: FounderScoreBreakdown
    red_flags: List[RedFlag]
    strengths: List[str]
    areas_of_concern: List[str]