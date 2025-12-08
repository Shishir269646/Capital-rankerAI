
from .scoring_schema import (
    DealData, ScoreRequest, ScoreResponse,
    ScoreBreakdown, DetailedAnalysis
)
from .thesis_schema import (
    ThesisMatchRequest, ThesisMatchResponse,
    SimilarityBreakdown, MatchedSection
)
from .founder_schema import (
    FounderEvaluationRequest, FounderEvaluationResponse,
    FounderScoreBreakdown, RedFlag
)

__all__ = [
    "DealData", "ScoreRequest", "ScoreResponse",
    "ThesisMatchRequest", "ThesisMatchResponse",
    "FounderEvaluationRequest", "FounderEvaluationResponse"
]