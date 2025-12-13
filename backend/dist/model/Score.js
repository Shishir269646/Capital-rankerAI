"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ScoreSchema = new mongoose_1.Schema({
    startup_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Startup',
        required: [true, 'Startup ID is required'],
        index: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    investment_fit_score: {
        type: Number,
        required: [true, 'Investment fit score is required'],
        min: [0, 'Score cannot be less than 0'],
        max: [100, 'Score cannot exceed 100'],
        index: true,
    },
    breakdown: {
        market_score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        traction_score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        team_score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        financial_score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        product_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        competitive_score: {
            type: Number,
            min: 0,
            max: 100,
        },
    },
    detailed_analysis: {
        market_size_estimate: {
            type: Number,
            min: 0,
        },
        growth_potential: {
            type: String,
            enum: ['low', 'medium', 'high', 'very-high'],
            required: true,
        },
        risk_level: {
            type: String,
            enum: ['low', 'medium', 'high', 'very-high'],
            required: true,
        },
        recommendation: {
            type: String,
            enum: ['pass', 'watch', 'consider', 'strong-consider', 'pursue'],
            required: true,
            index: true,
        },
        strengths: {
            type: [String],
            default: [],
        },
        weaknesses: {
            type: [String],
            default: [],
        },
        key_risks: {
            type: [String],
            default: [],
        },
        opportunities: {
            type: [String],
            default: [],
        },
    },
    confidence: {
        type: Number,
        required: [true, 'Confidence score is required'],
        min: [0, 'Confidence cannot be less than 0'],
        max: [1, 'Confidence cannot exceed 1'],
    },
    ml_model_version: {
        type: String,
        required: [true, 'ML model version is required'],
        index: true,
    },
    scoring_parameters: {
        weights_used: {
            market_weight: { type: Number, required: true, min: 0, max: 1 },
            traction_weight: { type: Number, required: true, min: 0, max: 1 },
            team_weight: { type: Number, required: true, min: 0, max: 1 },
            financial_weight: { type: Number, required: true, min: 0, max: 1 },
        },
        features_used: {
            type: [String],
            default: [],
        },
        algorithm: {
            type: String,
            required: true,
            enum: ['random-forest', 'gradient-boost', 'neural-network', 'ensemble'],
        },
    },
    scored_at: {
        type: Date,
        default: Date.now,
        required: true,
        index: true,
    },
    expires_at: {
        type: Date,
        index: true,
    },
    is_latest: {
        type: Boolean,
        default: true,
        index: true,
    },
    notes: {
        type: String,
        maxlength: 2000,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'scores',
});
ScoreSchema.index({ startup_id: 1, scored_at: -1 });
ScoreSchema.index({ startup_id: 1, is_latest: 1 });
ScoreSchema.index({ investment_fit_score: -1, 'detailed_analysis.recommendation': 1 });
ScoreSchema.index({ 'detailed_analysis.recommendation': 1, investment_fit_score: -1 });
ScoreSchema.pre('save', async function (next) {
    if (this.isNew) {
        await mongoose_1.default
            .model('Score')
            .updateMany({ startup_id: this.startup_id, _id: { $ne: this._id } }, { is_latest: false });
        if (!this.expires_at) {
            this.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    }
    next();
});
ScoreSchema.virtual('score_grade').get(function () {
    const score = this.investment_fit_score;
    if (score >= 90)
        return 'A+';
    if (score >= 80)
        return 'A';
    if (score >= 70)
        return 'B+';
    if (score >= 60)
        return 'B';
    if (score >= 50)
        return 'C';
    return 'D';
});
ScoreSchema.set('toJSON', { virtuals: true });
ScoreSchema.set('toObject', { virtuals: true });
exports.default = mongoose_1.default.model('Score', ScoreSchema);
//# sourceMappingURL=Score.js.map