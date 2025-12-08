
import numpy as np
from datetime import datetime
from typing import Dict, Any

class FeatureEngineering:
    """
    Extract and engineer features from raw data
    """
    
    def extract_features(self, deal_data: Dict[str, Any]) -> np.ndarray:
        """
        Extract numerical features from deal data
        """
        features = []
        
        # Revenue features
        features.append(np.log1p(deal_data.get('revenue', 0)))
        
        # Growth features
        features.append(deal_data.get('growth_rate_yoy', 0) / 100)
        features.append(deal_data.get('growth_rate_mom', 0) / 100)
        
        # Financial health features
        features.append(deal_data.get('runway_months', 0) / 24)  # Normalize to 2 years
        features.append(deal_data.get('burn_rate', 0) / 100000)  # Normalize
        
        # Team features
        features.append(np.log1p(deal_data.get('team_size', 1)))
        
        # Stage encoding (one-hot)
        stages = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c']
        stage_vector = [1 if deal_data.get('stage') == s else 0 for s in stages]
        features.extend(stage_vector)
        
        return np.array(features)