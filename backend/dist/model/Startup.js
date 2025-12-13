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
const StartupSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Startup name is required'],
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [50, 'Description must be at least 50 characters'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    short_pitch: {
        type: String,
        maxlength: [280, 'Short pitch cannot exceed 280 characters'],
    },
    sector: {
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
        index: true,
    },
    stage: {
        type: String,
        required: [true, 'Stage is required'],
        enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'],
        index: true,
    },
    funding_history: [
        {
            round_type: {
                type: String,
                required: true,
                enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'bridge', 'growth'],
            },
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            currency: {
                type: String,
                default: 'USD',
                enum: ['USD', 'EUR', 'GBP', 'BDT'],
            },
            date: {
                type: Date,
                required: true,
            },
            investors: [String],
            valuation: {
                type: Number,
                min: 0,
            },
        },
    ],
    metrics: {
        revenue: {
            type: Number,
            default: 0,
            min: 0,
        },
        arr: {
            type: Number,
            min: 0,
        },
        mrr: {
            type: Number,
            min: 0,
        },
        growth_rate_mom: {
            type: Number,
            default: 0,
        },
        growth_rate_yoy: {
            type: Number,
            default: 0,
        },
        burn_rate: {
            type: Number,
            default: 0,
            min: 0,
        },
        runway_months: {
            type: Number,
            default: 0,
            min: 0,
        },
        gross_margin: {
            type: Number,
            min: 0,
            max: 100,
        },
        customer_count: {
            type: Number,
            min: 0,
        },
        cac: {
            type: Number,
            min: 0,
        },
        ltv: {
            type: Number,
            min: 0,
        },
    },
    team_size: {
        type: Number,
        required: [true, 'Team size is required'],
        min: 1,
        default: 1,
    },
    founders: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Founder',
        },
    ],
    founded_date: {
        type: Date,
        required: [true, 'Founded date is required'],
    },
    website: {
        type: String,
        required: [true, 'Website is required'],
        trim: true,
        match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
    pitch_deck_url: {
        type: String,
        trim: true,
    },
    pitch_deck_text: {
        type: String,
        maxlength: 50000,
    },
    linkedin_url: {
        type: String,
        trim: true,
    },
    twitter_url: {
        type: String,
        trim: true,
    },
    location: {
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
            index: true,
        },
        region: {
            type: String,
        },
    },
    technology_stack: {
        type: [String],
        default: [],
    },
    business_model: {
        type: String,
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
    target_market: {
        type: String,
        maxlength: 500,
    },
    competitive_advantage: {
        type: String,
        maxlength: 1000,
    },
    competitors: {
        type: [String],
        default: [],
    },
    source: {
        type: String,
        required: true,
        enum: ['dealroom', 'crunchbase', 'manual', 'angellist'],
        default: 'manual',
        index: true,
    },
    external_id: {
        type: String,
        sparse: true,
        index: true,
    },
    last_synced: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'rejected', 'invested'],
        default: 'active',
        index: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    notes: [
        {
            user_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            content: {
                type: String,
                required: true,
                maxlength: 5000,
            },
            created_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'startups',
});
StartupSchema.index({ name: 'text', description: 'text', target_market: 'text' });
StartupSchema.index({ sector: 1, stage: 1, status: 1 });
StartupSchema.index({ 'location.country': 1, sector: 1 });
StartupSchema.index({ source: 1, external_id: 1 }, { unique: true, sparse: true });
StartupSchema.index({ created_at: -1 });
StartupSchema.virtual('total_funding').get(function () {
    return this.funding_history.reduce((sum, round) => sum + round.amount, 0);
});
StartupSchema.virtual('latest_valuation').get(function () {
    const sortedRounds = this.funding_history
        .filter((r) => r.valuation)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    return sortedRounds.length > 0 ? sortedRounds[0].valuation : null;
});
StartupSchema.set('toJSON', { virtuals: true });
StartupSchema.set('toObject', { virtuals: true });
exports.default = mongoose_1.default.model('Startup', StartupSchema);
//# sourceMappingURL=Startup.js.map