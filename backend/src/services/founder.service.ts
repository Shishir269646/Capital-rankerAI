import Founder, { IFounder } from '../model/Founder';
import { mlClientService } from './ml-client.service';

export class FounderService {
  /**
   * Evaluate founder using ML
   */
  async evaluateFounder(founderId: string): Promise<IFounder | null> {
    const founder = await Founder.findById(founderId);
    if (!founder) {
      return null;
    }

    // Call ML service for evaluation
    const evaluation = await mlClientService.evaluateFounder({
      education: founder.education,
      experience: founder.experience,
      previous_startups: founder.previous_startups,
      skills: founder.skills,
      achievements: founder.achievements,
    });

    // Update founder with scores and red flags
    founder.founder_score = {
      ...evaluation.founder_score,
      scored_at: new Date(),
    };

    // Add new red flags
    const newRedFlags = evaluation.red_flags.map((flag) => ({
      type: flag.type,
      description: flag.description,
      severity: flag.severity,
      detected_at: new Date(),
    }));

    founder.red_flags.push(...newRedFlags);

    await founder.save();
    return founder;
  }

  /**
   * Create a new founder
   */
  async createFounder(founderData: Partial<IFounder>): Promise<IFounder> {
    const founder = new Founder(founderData);
    await founder.save();
    return founder;
  }

  /**
   * Get founder by ID
   */
  async getFounderById(founderId: string): Promise<IFounder | null> {
    return await Founder.findById(founderId).populate('startup_id');
  }

  /**
   * Update founder information
   */
  async updateFounder(founderId: string, updateData: Partial<IFounder>): Promise<IFounder | null> {
    return await Founder.findByIdAndUpdate(
      founderId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Get founders by startup
   */
  async getFoundersByStartup(startupId: string): Promise<IFounder[]> {
    return await Founder.find({ startup_id: startupId });
  }
}

export const founderService = new FounderService();
