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
}

export const portfolioService = new PortfolioService();
