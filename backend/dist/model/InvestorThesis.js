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
const InvestorThesisSchema = new mongoose_1.Schema({
    investor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Investor ID is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Thesis title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    thesis_text: {
        type: String,
        required: [true, 'Thesis text is required'],
        minlength: [100, 'Thesis must be at least 100 characters'],
        maxlength: [10000, 'Thesis cannot exceed 10000 characters'],
    },
    thesis_embedding: {
        type: [Number],
        default: undefined,
        select: false,
    },
    focus_areas: {
        sectors: {
            type: [String],
            required: [true, 'At least one sector is required'],
            enum: [
                'fintech',
                'healthtech',
                'edtech',
                'e-commerce',
                'saas',
                'ai-ml',
                'blockchain',
                'iot',
                'cybersecurity',
                'climate-tech',
                'agritech',
                'mobility',
                'real-estate',
                'logistics',
                'hr-tech',
                'martech',
                'consumer',
                'enterprise',
                'devtools',
                'other',
            ],
        },
        stages: {
            type: [String],
            required: [true, 'At least one stage is required'],
            enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'],
        },
        geographies: {
            type: [String],
            required: [true, 'At least one geography is required'],
        },
        business_models: {
            type: [String],
            enum: [
                'B2B',
                'B2C',
                'B2B2C',
                'marketplace',
                'subscription',
                'transaction-based',
                'freemium',
                'other',
            ],
        },
    },
    investment_criteria: {
        min_revenue: {
            type: Number,
            min: 0,
        },
        min_growth_rate: {
            type: Number,
            min: 0,
        },
        min_team_size: {
            type: Number,
            min: 1,
        },
        max_burn_rate: {
            type: Number,
            min: 0,
        },
        check_size_min: {
            type: Number,
            min: 0,
        },
        check_size_max: {
            type: Number,
            min: 0,
        },
        must_have_features: {
            type: [String],
            default: [],
        },
        deal_breakers: {
            type: [String],
            default: [],
        },
    },
    key_themes: {
        type: [String],
        default: [],
        index: true,
    },
    preferred_technologies: {
        type: [String],
        default: [],
    },
    exclusions: {
        type: [String],
        default: [],
    },
    target_metrics: {
        target_irr: {
            type: Number,
            min: 0,
            max: 100,
        },
        target_multiple: {
            type: Number,
            min: 1,
        },
        investment_horizon_years: {
            type: Number,
            min: 1,
            max: 20,
        },
    },
    examples: {
        positive_examples: {
            type: [String],
            default: [],
        },
        negative_examples: {
            type: [String],
            default: [],
        },
    },
    is_active: {
        type: Boolean,
        default: true,
        index: true,
    },
    version: {
        type: Number,
        default: 1,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'investor_theses',
});
InvestorThesisSchema.index({ investor_id: 1, is_active: 1 });
InvestorThesisSchema.index({ 'focus_areas.sectors': 1, 'focus_areas.stages': 1 });
InvestorThesisSchema.index({ thesis_text: 'text', title: 'text' });
InvestorThesisSchema.pre('save', function (next) {
    if (!this.isNew && this.isModified()) {
        this.version += 1;
    }
    next();
});
InvestorThesisSchema.methods.matchesCriteria = function (startup) {
    const criteria = this.investment_criteria;
    if (criteria.min_revenue && startup.metrics.revenue < criteria.min_revenue) {
        return false;
    }
    if (criteria.min_growth_rate && startup.metrics.growth_rate_yoy < criteria.min_growth_rate) {
        return false;
    }
    if (criteria.min_team_size && startup.team_size < criteria.min_team_size) {
        return false;
    }
    if (criteria.max_burn_rate && startup.metrics.burn_rate > criteria.max_burn_rate) {
        return false;
    }
    const sectorMatch = this.focus_areas.sectors.some((sector) => startup.sector.includes(sector));
    if (!sectorMatch) {
        return false;
    }
    if (!this.focus_areas.stages.includes(startup.stage)) {
        return false;
    }
    const geoMatch = this.focus_areas.geographies.some((geo) => startup.location.country.toLowerCase().includes(geo.toLowerCase()) ||
        startup.location.region?.toLowerCase().includes(geo.toLowerCase()));
    if (!geoMatch) {
        return false;
    }
    return true;
};
exports.default = mongoose_1.default.model('InvestorThesis', InvestorThesisSchema);
//# sourceMappingURL=InvestorThesis.js.map