from app.schemas.founder_schema import (
    FounderData,
    FounderEvaluationResponse,
    FounderScoreBreakdown,
    RedFlag
)
from app.utils.logger import setup_logger

logger = setup_logger()

class FounderEvaluator:
    """
    Evaluate founder profile and experience
    """
    
    def __init__(self):
        logger.info("Founder evaluator initialized")
    
    def evaluate(self, founder_data: FounderData) -> FounderEvaluationResponse:
        """
        Evaluate founder and generate score
        """
        # Calculate individual scores
        education_score = self._evaluate_education(founder_data.education)
        experience_score = self._evaluate_experience(founder_data.experience)
        track_record_score = self._evaluate_track_record(
            founder_data.previous_startups
        )
        leadership_score = self._evaluate_leadership(founder_data.skills)
        domain_score = self._evaluate_domain_expertise(founder_data.skills)
        adaptability_score = self._evaluate_adaptability(founder_data)
        
        # Calculate overall score (weighted average)
        overall_score = (
            education_score * 0.15 +
            experience_score * 0.25 +
            track_record_score * 0.25 +
            leadership_score * 0.15 +
            domain_score * 0.10 +
            adaptability_score * 0.10
        )
        
        # Detect red flags
        red_flags = self._detect_red_flags(founder_data)
        
        # Generate strengths
        strengths = self._generate_strengths(
            founder_data,
            experience_score,
            track_record_score
        )
        
        # Generate areas of concern
        concerns = self._generate_concerns(
            founder_data,
            red_flags
        )
        
        return FounderEvaluationResponse(
            founder_score=FounderScoreBreakdown(
                overall_score=round(overall_score, 2),
                experience_score=round(experience_score, 2),
                education_score=round(education_score, 2),
                track_record_score=round(track_record_score, 2),
                leadership_score=round(leadership_score, 2),
                adaptability_score=round(adaptability_score, 2),
                domain_expertise_score=round(domain_score, 2)
            ),
            red_flags=red_flags,
            strengths=strengths,
            areas_of_concern=concerns
        )
    
    def _evaluate_education(self, education: list) -> float:
        """Evaluate educational background"""
        if not education:
            return 40.0
        
        score = 50.0
        
        # Check for advanced degrees
        degrees = [e.degree for e in education]
        if 'phd' in degrees:
            score += 30
        elif 'master' in degrees or 'mba' in degrees:
            score += 20
        elif 'bachelor' in degrees:
            score += 10
        
        # Check for graduation
        if any(e.graduated for e in education):
            score += 10
        
        return min(100, score)
    
    def _evaluate_experience(self, experience: list) -> float:
        """Evaluate work experience"""
        if not experience:
            return 30.0
        
        score = 40.0
        
        # Calculate total years
        total_years = sum(e.duration_years for e in experience)
        
        if total_years >= 10:
            score += 30
        elif total_years >= 5:
            score += 20
        elif total_years >= 2:
            score += 10
        
        # Check for achievements
        total_achievements = sum(len(e.achievements) for e in experience)
        if total_achievements >= 10:
            score += 20
        elif total_achievements >= 5:
            score += 10
        
        return min(100, score)
    
    def _evaluate_track_record(self, startups: list) -> float:
        """Evaluate previous startup experience"""
        if not startups:
            return 40.0  # Not a negative, just neutral
        
        score = 50.0
        
        # Check outcomes
        for startup in startups:
            if startup.outcome == 'exit':
                score += 25
                if startup.exit_value and startup.exit_value > 10000000:  # $10M+
                    score += 10
            elif startup.outcome == 'acquired':
                score += 20
            elif startup.outcome == 'active':
                score += 10
            elif startup.outcome == 'failed':
                score += 5  # Experience still valuable
        
        return min(100, score)
    
    def _evaluate_leadership(self, skills: any) -> float:
        """Evaluate leadership capabilities"""
        score = 50.0
        
        if skills.leadership_experience:
            score += 30
        
        if skills.years_of_experience >= 5:
            score += 20
        
        return min(100, score)
    
    def _evaluate_domain_expertise(self, skills: any) -> float:
        """Evaluate domain expertise"""
        score = 40.0
        
        if len(skills.domain_expertise) >= 3:
            score += 30
        elif len(skills.domain_expertise) >= 1:
            score += 20
        
        if len(skills.technical_skills) >= 5:
            score += 20
        elif len(skills.technical_skills) >= 2:
            score += 10
        
        return min(100, score)
    
    def _evaluate_adaptability(self, founder_data: FounderData) -> float:
        """Evaluate adaptability based on diverse experience"""
        score = 50.0
        
        # Check for diverse roles
        if len(founder_data.experience) >= 3:
            score += 25
        
        # Check for continuous learning (recent education)
        if founder_data.achievements:
            score += 25
        
        return min(100, score)
    
    def _detect_red_flags(self, founder_data: FounderData) -> list:
        """Detect potential red flags"""
        flags = []
        
        # Check for employment gaps
        if len(founder_data.experience) == 0:
            flags.append(RedFlag(
                type="limited-experience",
                description="Limited or no professional experience",
                severity="medium"
            ))
        
        # Check for failed startups without learnings
        failed_count = sum(
            1 for s in founder_data.previous_startups 
            if s.outcome == 'failed'
        )
        if failed_count >= 2:
            flags.append(RedFlag(
                type="multiple-failures",
                description="Multiple failed startups",
                severity="low"
            ))
        
        # Check for very short tenures
        short_tenures = sum(
            1 for e in founder_data.experience 
            if e.duration_years < 1
        )
        if short_tenures >= 3:
            flags.append(RedFlag(
                type="frequent-job-changes",
                description="Frequent job changes may indicate instability",
                severity="medium"
            ))
        
        return flags
    
    def _generate_strengths(
        self,
        founder_data: FounderData,
        exp_score: float,
        track_score: float
    ) -> list:
        """Generate list of strengths"""
        strengths = []
        
        if exp_score >= 70:
            strengths.append("Strong professional experience")
        
        if track_score >= 70:
            strengths.append("Proven track record with previous ventures")
        
        if len(founder_data.skills.domain_expertise) >= 2:
            strengths.append("Deep domain expertise")
        
        if founder_data.skills.leadership_experience:
            strengths.append("Demonstrated leadership capabilities")
        
        if not strengths:
            strengths.append("Entrepreneurial drive and ambition")
        
        return strengths
    
    def _generate_concerns(
        self,
        founder_data: FounderData,
        red_flags: list
    ) -> list:
        """Generate areas of concern"""
        concerns = []
        
        if not founder_data.experience:
            concerns.append("Limited professional experience")
        
        if not founder_data.previous_startups:
            concerns.append("First-time founder - higher risk profile")
        
        if red_flags:
            for flag in red_flags:
                if flag.severity in ['high', 'medium']:
                    concerns.append(flag.description)
        
        if not concerns:
            concerns.append("Standard first-time founder risks")
        
        return concerns
