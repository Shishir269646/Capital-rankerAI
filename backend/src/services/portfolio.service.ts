import Portfolio from '../model/Portfolio';

export class PortfolioService {
  /**
   * Get portfolio
   */
  async getPortfolio(userId: string, filters: any): Promise<any> {
    const { status, page, limit } = filters;
    const query: any = { investor_id: userId };

    if (status) {
      query['current_status.status'] = status;
    }

    const skip = (page - 1) * limit;
    const portfolio = await Portfolio.find(query).populate('startup_id').skip(skip).limit(limit);

    const total = await Portfolio.countDocuments(query);

    return {
      portfolio,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get portfolio performance
   */
  async getPortfolioPerformance(portfolioId: string, userId: string): Promise<any> {
    return await Portfolio.findOne({
      _id: portfolioId,
      investor_id: userId,
    }).populate('startup_id');
  }

  /**
   * Update portfolio metrics
   */
  async updatePortfolioMetrics(portfolioId: string, userId: string, metrics: any): Promise<any> {
    return await Portfolio.findOneAndUpdate(
      { _id: portfolioId, investor_id: userId },
      { $set: { performance_metrics: metrics } },
      { new: true }
    );
  }

  /**
   * Get portfolio analytics
   */
  async getPortfolioAnalytics(userId: string): Promise<any> {
    const portfolio = await Portfolio.find({ investor_id: userId });

    return {
      total_investments: portfolio.length,
      total_invested: portfolio.reduce((sum, p) => sum + p.investment_details.amount_invested, 0),
      active_companies: portfolio.filter((p) => p.current_status.status === 'active').length,
      exited_companies: portfolio.filter((p) => p.current_status.status === 'exited').length,
    };
  }

  /**
   * Get single portfolio item by ID
   */
  async getPortfolioItemById(portfolioId: string, userId: string): Promise<any> {
    return await Portfolio.findOne({
      _id: portfolioId,
      investor_id: userId,
    }).populate('startup_id');
  }

  /**
   * Create a new portfolio item linked to a startup.
   * Minimal fields to create a new portfolio entry.
   */
  async createPortfolioItem(startupId: string, investorId: string): Promise<any> {
    const newPortfolio = new Portfolio({
      startup_id: startupId,
      investor_id: investorId,
      investment_details: { // Default values
        investment_date: new Date(),
        amount_invested: 0,
        currency: 'USD',
        ownership_percentage: 0,
        valuation_at_investment: 0,
        round_type: 'seed', // Default to seed round
        lead_investor: false,
        board_seat: false,
      },
      current_status: { // Default values
        status: 'active',
      },
      performance_metrics: {}, // Empty object
      milestones: [],
      kpi_tracking: [],
      follow_on_rounds: [],
      risk_assessment: { // Default values
        risk_level: 'medium',
        risk_factors: [],
        last_assessed: new Date(),
      },
      notes: [],
    });

    await newPortfolio.save();
    return newPortfolio.populate('startup_id'); // Populate startup details after creation
  }
}

export const portfolioService = new PortfolioService();

