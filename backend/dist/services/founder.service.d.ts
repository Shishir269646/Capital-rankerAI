import { IFounder } from '../model/Founder';
export declare class FounderService {
    evaluateFounder(founderId: string): Promise<IFounder | null>;
    getFounderById(founderId: string): Promise<IFounder | null>;
    updateFounder(founderId: string, updateData: Partial<IFounder>): Promise<IFounder | null>;
    getFoundersByStartup(startupId: string): Promise<IFounder[]>;
}
export declare const founderService: FounderService;
//# sourceMappingURL=founder.service.d.ts.map