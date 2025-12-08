# ============================================
# app/services/scoring_service.py
# Investment Scoring Service
# ============================================

import numpy as np
from typing import Optional
from app.schemas.scoring_schema import (
    DealData, ScoringWeights, ScoreResponse,
    ScoreBreakdown, DetailedAnalysis
)
from app.services.feature_engineering import FeatureEngineering
from app.config.settings import settings
from app.utils.logger import setup_logger

logger = setup_logger()
feature_eng = FeatureEngineering()

class ScoringService:
    """
    Investment scoring service using ML
    """
    
    def __init__(self):
        self.model_version = settings.ML_MODEL_VERSION
        logger.info(f"Scoring service initialized (v{self.model_version})")
    
    def score_deal(
        self, 
        deal_data: DealData,
        custom_weights: Optional[ScoringWeights] = None
    ) -> ScoreResponse:
        """
        Score a deal based on multiple factors
        """
        # Use default weights if not provided
        weights = custom_weights or ScoringWeights()
        
        # Calculate individual scores
        market_score = self._calculate_market_score(deal_data)
        traction_score = self._calculate_traction_score(deal_data)
        team_score = self._calculate_team_score(deal_data)
        financial_score = self._calculate_financial_score(deal_data)
        
        # Calculate weighted overall score
        overall_score = (
            market_score * weights.market_weight +
            traction_score * weights.traction_weight +
            team_score * weights.team_weight +
            financial_score * weights.financial_weight
        )
        
        # Ensure score is between 0-100
        overall_score = max(0, min(100, overall_score))
        
        # Generate detailed analysis
        analysis = self._generate_analysis(
            deal_data, 
            overall_score,
            market_score,
            traction_score,
            team_score,
            financial_score
        )
        
        # Calculate confidence based on data completeness
        confidence = self._calculate_confidence(deal_data)
        
        return ScoreResponse(
            investment_fit_score=round(overall_score, 2),
            breakdown=ScoreBreakdown(
                market_score=round(market_score, 2),
                traction_score=round(traction_score, 2),
                team_score=round(team_score, 2),
                financial_score=round(financial_score, 2)
            ),
            detailed_analysis=analysis,
            confidence=round(confidence, 2),
            ml_model_version=self.model_version
        )
    
    def _calculate_market_score(self, deal: DealData) -> float:
        """Calculate market opportunity score"""
        score = 50.0  # Base score
        
        # Sector scoring (high-growth sectors get higher scores)
        high_growth_sectors = ['ai-ml', 'fintech', 'healthtech', 'saas']
        if any(sector in high_growth_sectors for sector in deal.sector):
            score += 20
        
        # Stage scoring (earlier stages have higher growth potential)
        stage_scores = {
            'pre-seed': 15,
            'seed': 12,
            'series-a': 10,
            'series-b': 8,
            'series-c': 5
        }
        score += stage_scores.get(deal.stage, 5)
        
        # Location scoring (tech hubs get bonus)
        tech_hubs = ['US', 'United States', 'UK', 'Singapore', 'India']
        if any(hub.lower() in deal.location.get('country', '').lower() 
               for hub in tech_hubs):
            score += 10
        
        return min(100, score)
    
    def _calculate_traction_score(self, deal: DealData) -> float:
        """Calculate traction and growth score"""
        score = 30.0  # Base score
        
        metrics = deal.metrics
        
        # Revenue score
        if metrics.revenue > 1000000:  # $1M+
            score += 25
        elif metrics.revenue > 500000:  # $500K+
            score += 20
        elif metrics.revenue > 100000:  # $100K+
            score += 15
        elif metrics.revenue > 0:
            score += 10
        
        # Growth rate score
        if metrics.growth_rate_yoy > 200:  # 200%+ YoY
            score += 25
        elif metrics.growth_rate_yoy > 100:  # 100%+ YoY
            score += 20
        elif metrics.growth_rate_yoy > 50:  # 50%+ YoY
            score += 15
        elif metrics.growth_rate_yoy > 20:  # 20%+ YoY
            score += 10
        
        # Customer count (if available)
        if metrics.customer_count:
            if metrics.customer_count > 10000:
                score += 10
            elif metrics.customer_count > 1000:
                score += 7
            elif metrics.customer_count > 100:
                score += 5
        
        return min(100, score)
    
    def _calculate_team_score(self, deal: DealData) -> float:
        """Calculate team quality score"""
        score = 40.0  # Base score
        
        # Team size scoring
        if deal.team_size >= 20:
            score += 20
        elif deal.team_size >= 10:
            score += 15
        elif deal.team_size >= 5:
            score += 10
        elif deal.team_size >= 2:
            score += 5
        
        # Company age (maturity indicator)
        # Simple heuristic: older companies with teams are more stable
        score += 15  # Placeholder for founder experience
        
        return min(100, score)
    
    def _calculate_financial_score(self, deal: DealData) -> float:
        """Calculate financial health score"""
        score = 40.0  # Base score
        
        metrics = deal.metrics
        
        # Burn rate vs runway
        if metrics.runway_months > 24:  # 2+ years runway
            score += 25
        elif metrics.runway_months > 12:  # 1+ year runway
            score += 20
        elif metrics.runway_months > 6:  # 6+ months runway
            score += 10
        elif metrics.runway_months > 3:  # 3+ months runway
            score += 5
        else:
            score -= 10  # Critical runway
        
        # Gross margin (if available)
        if metrics.gross_margin:
            if metrics.gross_margin > 70:
                score += 15
            elif metrics.gross_margin > 50:
                score += 10
            elif metrics.gross_margin > 30:
                score += 5
        
        # Unit economics (if available)
        if metrics.customer_count and metrics.customer_count > 0:
            score += 10
        
        return max(0, min(100, score))
    
    def _generate_analysis(
        self,
        deal: DealData,
        overall_score: float,
        market: float,
        traction: float,
        team: float,
        financial: float
    ) -> DetailedAnalysis:
        """Generate detailed investment analysis"""
        
        # Determine growth potential
        if traction >= 80:
            growth = "very-high"
        elif traction >= 60:
            growth = "high"
        elif traction >= 40:
            growth = "medium"
        else:
            growth = "low"
        
        # Determine risk level
        if financial < 40 or deal.metrics.runway_months < 6:
            risk = "high"
        elif financial < 60:
            risk = "medium"
        else:
            risk = "low"
        
        # Determine recommendation
        if overall_score >= 80:
            recommendation = "pursue"
        elif overall_score >= 70:
            recommendation = "strong-consider"
        elif overall_score >= 60:
            recommendation = "consider"
        elif overall_score >= 50:
            recommendation = "watch"
        else:
            recommendation = "pass"
        
        # Generate strengths
        strengths = []
        if market >= 70:
            strengths.append("Strong market opportunity in growing sector")
        if traction >= 70:
            strengths.append("Excellent traction and growth metrics")
        if team >= 70:
            strengths.append("Experienced team with domain expertise")
        if financial >= 70:
            strengths.append("Solid financial position with healthy runway")
        
        if not strengths:
            strengths.append("Promising early-stage opportunity")
        
        # Generate weaknesses
        weaknesses = []
        if market < 50:
            weaknesses.append("Limited market opportunity or competitive sector")
        if traction < 50:
            weaknesses.append("Needs to demonstrate stronger traction")
        if team < 50:
            weaknesses.append("Small team size may limit execution capability")
        if financial < 50:
            weaknesses.append("Limited runway requires attention")
        
        # Generate key risks
        risks = []
        if deal.metrics.runway_months < 6:
            risks.append("Critical: Short runway (< 6 months)")
        if deal.metrics.growth_rate_yoy < 20:
            risks.append("Slow growth rate may indicate market fit issues")
        if deal.team_size < 3:
            risks.append("Very small team size")
        
        if not risks:
            risks.append("Standard startup execution risks")
        
        # Generate opportunities
        opportunities = []
        if 'ai-ml' in deal.sector or 'saas' in deal.sector:
            opportunities.append("Operating in high-growth technology sector")
        if deal.metrics.growth_rate_yoy > 50:
            opportunities.append("Strong growth momentum to capitalize on")
        if deal.stage in ['seed', 'series-a']:
            opportunities.append("Early-stage entry with significant upside potential")
        
        return DetailedAnalysis(
            growth_potential=growth,
            risk_level=risk,
            recommendation=recommendation,
            strengths=strengths,
            weaknesses=weaknesses,
            key_risks=risks,
            opportunities=opportunities
        )
    
    def _calculate_confidence(self, deal: DealData) -> float:
        """
        Calculate confidence score based on data completeness
        """
        confidence = 0.5  # Base confidence
        
        # Check data completeness
        if deal.metrics.revenue > 0:
            confidence += 0.1
        if deal.metrics.growth_rate_yoy != 0:
            confidence += 0.1
        if deal.metrics.customer_count:
            confidence += 0.1
        if deal.metrics.gross_margin:
            confidence += 0.1
        if deal.team_size >= 5:
            confidence += 0.1
        
        return min(1.0, confidence)

# ============================================
# app/services/feature_engineering.py
# Feature Engineering for ML Models
# ============================================


# ============================================
# app/services/__init__.py
# ============================================
