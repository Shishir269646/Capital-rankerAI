# Capital Ranker - AI Deal Flow Optimizer

AI-powered venture capital deal flow optimization platform.

## 🚀 Features

- **Automated Data Aggregation**: Sync deals from DealRoom, Crunchbase, and other sources
- **AI Deal Scoring**: ML-powered investment fit scoring and ranking
- **Thesis Matching**: NLP-based matching between investment thesis and pitch decks
- **Founder Evaluation**: Comprehensive founder profile analysis
- **Portfolio Management**: Track and monitor portfolio company performance
- **Strategic Alerts**: Real-time notifications for market changes and opportunities
- **Custom Reports**: Generate detailed investment analysis reports

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- Redis >= 6.0
- Python ML Service (separate repository)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/capital-ranker-backend.git
cd capital-ranker-backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB and Redis:
```bash
# Using Docker
docker-compose up -d mongodb redis
```

5. Run database migrations:
```bash
npm run migrate
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

API is available at: `http://localhost:5000/api`

### Main Endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Deals**: `/api/v1/deals/*`
- **Scoring**: `/api/v1/scoring/*`
- **Thesis**: `/api/v1/thesis/*`
- **Founders**: `/api/v1/founders/*`
- **Alerts**: `/api/v1/alerts/*`
- **Portfolio**: `/api/v1/portfolio/*`
- **Reports**: `/api/v1/reports/*`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

## 🔧 Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── models/          # Database models
├── services/        # Business logic
├── routes/          # API routes
├── middleware/      # Express middleware
├── validators/      # Request validation
├── types/           # TypeScript types
├── utils/           # Utility functions
├── jobs/            # Background jobs
├── integrations/    # External API clients
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📝 License

MIT License - see LICENSE file for details

## 👥 Team

Capital Ranker Development Team

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.