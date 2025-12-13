"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioService = exports.PortfolioService = void 0;
const Portfolio_1 = __importDefault(require("../model/Portfolio"));
class PortfolioService {
    async getPortfolio(userId, filters) {
        const { status, page, limit } = filters;
        const query = { investor_id: userId };
        if (status) {
            query['current_status.status'] = status;
        }
        const skip = (page - 1) * limit;
        const portfolio = await Portfolio_1.default.find(query).populate('startup_id').skip(skip).limit(limit);
        const total = await Portfolio_1.default.countDocuments(query);
        return {
            portfolio,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getPortfolioPerformance(portfolioId, userId) {
        return await Portfolio_1.default.findOne({
            _id: portfolioId,
            investor_id: userId,
        }).populate('startup_id');
    }
    async updatePortfolioMetrics(portfolioId, userId, metrics) {
        return await Portfolio_1.default.findOneAndUpdate({ _id: portfolioId, investor_id: userId }, { $set: { performance_metrics: metrics } }, { new: true });
    }
    async getPortfolioAnalytics(userId) {
        const portfolio = await Portfolio_1.default.find({ investor_id: userId });
        return {
            total_investments: portfolio.length,
            total_invested: portfolio.reduce((sum, p) => sum + p.investment_details.amount_invested, 0),
            active_companies: portfolio.filter((p) => p.current_status.status === 'active').length,
            exited_companies: portfolio.filter((p) => p.current_status.status === 'exited').length,
        };
    }
    async getPortfolioItemById(portfolioId, userId) {
        return await Portfolio_1.default.findOne({
            _id: portfolioId,
            investor_id: userId,
        }).populate('startup_id');
    }
    async createPortfolioItem(startupId, investorId) {
        const newPortfolio = new Portfolio_1.default({
            startup_id: startupId,
            investor_id: investorId,
            investment_details: {
                investment_date: new Date(),
                amount_invested: 0,
                currency: 'USD',
                ownership_percentage: 0,
                valuation_at_investment: 0,
                round_type: 'seed',
                lead_investor: false,
                board_seat: false,
            },
            current_status: {
                status: 'active',
            },
            performance_metrics: {},
            milestones: [],
            kpi_tracking: [],
            follow_on_rounds: [],
            risk_assessment: {
                risk_level: 'medium',
                risk_factors: [],
                last_assessed: new Date(),
            },
            notes: [],
        });
        await newPortfolio.save();
        return newPortfolio.populate('startup_id');
    }
}
exports.PortfolioService = PortfolioService;
exports.portfolioService = new PortfolioService();
//# sourceMappingURL=portfolio.service.js.map