# ============================================
# app/services/nlp_service.py
# NLP Service for Thesis Matching
# ============================================

from typing import List, Tuple
import re
from collections import Counter
from app.schemas.thesis_schema import (
    ThesisMatchResponse,
    SimilarityBreakdown,
    MatchedSection
)
from app.utils.logger import setup_logger

logger = setup_logger()

class NLPService:
    """
    NLP service for text analysis and matching
    Simple implementation without heavy ML libraries
    """
    
    def __init__(self):
        self.stop_words = set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
            'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
        ])
        logger.info("NLP service initialized")
    
    def match_thesis(
        self,
        pitch_text: str,
        thesis_text: str
    ) -> ThesisMatchResponse:
        """
        Match investor thesis with startup pitch
        """
        # Preprocess texts
        pitch_clean = self._preprocess_text(pitch_text)
        thesis_clean = self._preprocess_text(thesis_text)
        
        # Extract keywords
        pitch_keywords = self._extract_keywords(pitch_clean)
        thesis_keywords = self._extract_keywords(thesis_clean)
        
        # Find matched keywords
        matched = set(pitch_keywords) & set(thesis_keywords)
        matched_keywords = list(matched)[:10]  # Top 10
        
        # Calculate semantic similarity (simple word overlap)
        semantic_sim = self._calculate_similarity(
            pitch_keywords,
            thesis_keywords
        )
        
        # Calculate relevancy score
        relevancy = semantic_sim * 100
        
        # Create similarity breakdown
        breakdown = SimilarityBreakdown(
            sector_match=semantic_sim * 100,
            stage_match=semantic_sim * 100,
            semantic_similarity=semantic_sim * 100
        )
        
        # Find matched sections
        matched_sections = self._find_matched_sections(
            pitch_text,
            thesis_text,
            matched_keywords
        )
        
        return ThesisMatchResponse(
            relevancy_score=round(relevancy, 2),
            matched_keywords=matched_keywords,
            similarity_breakdown=breakdown,
            matched_sections=matched_sections
        )
    
    def _preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def _extract_keywords(self, text: str, top_n: int = 20) -> List[str]:
        """Extract important keywords from text"""
        # Split into words
        words = text.split()
        
        # Remove stop words
        words = [w for w in words if w not in self.stop_words and len(w) > 3]
        
        # Count word frequency
        word_freq = Counter(words)
        
        # Get top N keywords
        keywords = [word for word, _ in word_freq.most_common(top_n)]
        
        return keywords
    
    def _calculate_similarity(
        self,
        keywords1: List[str],
        keywords2: List[str]
    ) -> float:
        """
        Calculate Jaccard similarity between two keyword lists
        """
        set1 = set(keywords1)
        set2 = set(keywords2)
        
        if not set1 or not set2:
            return 0.0
        
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        return intersection / union if union > 0 else 0.0
    
    def _find_matched_sections(
        self,
        pitch: str,
        thesis: str,
        keywords: List[str]
    ) -> List[MatchedSection]:
        """
        Find text sections that contain matched keywords
        """
        sections = []
        
        # Split into sentences
        pitch_sentences = re.split(r'[.!?]+', pitch)
        thesis_sentences = re.split(r'[.!?]+', thesis)
        
        # Find sentences with keywords
        for keyword in keywords[:5]:  # Top 5 keywords
            # Find in pitch
            pitch_matches = [s.strip() for s in pitch_sentences 
                           if keyword.lower() in s.lower()]
            
            # Find in thesis
            thesis_matches = [s.strip() for s in thesis_sentences 
                            if keyword.lower() in s.lower()]
            
            if pitch_matches and thesis_matches:
                sections.append(MatchedSection(
                    thesis_section=thesis_matches[0][:200],
                    pitch_section=pitch_matches[0][:200],
                    similarity=0.8
                ))
                
                if len(sections) >= 3:  # Limit to 3 sections
                    break
        
        return sections
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate simple text embedding (word frequency based)
        For production, use sentence-transformers or OpenAI embeddings
        """
        # Preprocess
        clean_text = self._preprocess_text(text)
        keywords = self._extract_keywords(clean_text, top_n=50)
        
        # Create frequency vector (simplified 128-dim embedding)
        word_freq = Counter(keywords)
        max_freq = max(word_freq.values()) if word_freq else 1
        
        # Normalize frequencies to create embedding
        embedding = []
        for i in range(128):
            if i < len(keywords):
                freq = word_freq.get(keywords[i], 0)
                embedding.append(freq / max_freq)
            else:
                embedding.append(0.0)
        
        return embedding

# ============================================
# app/models/founder_evaluator.py
# Founder Evaluation Model
# ============================================


# ============================================
# app/models/__init__.py
# ============================================
