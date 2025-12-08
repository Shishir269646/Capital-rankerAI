AI/ML powered investment scoring and analysis service.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Server
```bash
python run.py
```

Server will start at: http://localhost:8000

## 📚 API Documentation

Interactive API docs available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔌 Endpoints

### 1. Score Deal
```bash
POST /api/v1/score_deal
```

### 2. Match Thesis
```bash
POST /api/v1/match_thesis
```

### 3. Evaluate Founder
```bash
POST /api/v1/evaluate_founder
```

### 4. Health Check
```bash
GET /health
```

## 🧪 Testing

### Test Scoring Endpoint
```bash
curl -X POST http://localhost:8000/api/v1/score_deal \
  -H "Content-Type: application/json" \
  -d '{
    "deal_data": {
      "name": "Test Startup",
      "description": "AI-powered fintech platform",
      "sector": ["fintech", "ai-ml"],
      "stage": "seed",
      "metrics": {
        "revenue": 500000,
        "growth_rate_yoy": 150,
        "burn_rate": 50000,
        "runway_months": 18
      },
      "team_size": 8,
      "founded_date": "2022-01-01",
      "location": {
        "city": "San Francisco",
        "country": "US"
      }
    }
  }'
```

## 🐳 Docker (Optional)

### Build Image
```bash
docker build -t capital-ranker-ml .
```

### Run Container
```bash
docker run -p 8000:8000 capital-ranker-ml
```

## 📝 Development

### Project Structure
```
app/
├── main.py              # FastAPI app
├── api/                 # API endpoints
├── models/              # ML models
├── services/            # Business logic
├── schemas/             # Data validation
└── config/              # Configuration
```

## 🛠️ Technologies

- **FastAPI**: Modern web framework
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server
- **NumPy**: Numerical computing

## 📄 License

MIT License