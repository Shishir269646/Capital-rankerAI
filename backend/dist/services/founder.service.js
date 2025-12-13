"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.founderService = exports.FounderService = void 0;
const Founder_1 = __importDefault(require("../model/Founder"));
const ml_client_service_1 = require("./ml-client.service");
class FounderService {
    async evaluateFounder(founderId) {
        const founder = await Founder_1.default.findById(founderId);
        if (!founder) {
            return null;
        }
        const evaluation = await ml_client_service_1.mlClientService.evaluateFounder({
            education: founder.education,
            experience: founder.experience,
            previous_startups: founder.previous_startups,
            skills: founder.skills,
            achievements: founder.achievements,
        });
        founder.founder_score = {
            ...evaluation.founder_score,
            scored_at: new Date(),
        };
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
    async getFounderById(founderId) {
        return await Founder_1.default.findById(founderId).populate('startup_id');
    }
    async updateFounder(founderId, updateData) {
        return await Founder_1.default.findByIdAndUpdate(founderId, { $set: updateData }, { new: true, runValidators: true });
    }
    async getFoundersByStartup(startupId) {
        return await Founder_1.default.find({ startup_id: startupId });
    }
}
exports.FounderService = FounderService;
exports.founderService = new FounderService();
//# sourceMappingURL=founder.service.js.map