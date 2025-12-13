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
const PortfolioSchema = new mongoose_1.Schema({
    startup_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true,
        index: true,
    },
    investor_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    investment_details: {
        investment_date: {
            type: Date,
            required: true,
        },
        amount_invested: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'BDT'],
        },
        ownership_percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        valuation_at_investment: {
            type: Number,
            required: true,
            min: 0,
        },
        round_type: {
            type: String,
            required: true,
            enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth'],
        },
        lead_investor: {
            type: Boolean,
            default: false,
        },
        board_seat: {
            type: Boolean,
            default: false,
        },
    },
    current_status: {
        current_valuation: Number,
        unrealized_multiple: Number,
        ownership_diluted_percentage: Number,
        status: {
            type: String,
            enum: ['active', 'exited', 'written-off', 'zombie'],
            default: 'active',
            index: true,
        },
    },
    performance_metrics: {
        last_reported_revenue: Number,
        last_reported_arr: Number,
        last_reported_growth_rate: Number,
        last_reported_burn_rate: Number,
        last_reported_runway: Number,
        last_update_date: Date,
    },
    milestones: [
        {
            title: {
                type: String,
                required: true,
            },
            description: String,
            achieved: {
                type: Boolean,
                default: false,
            },
            target_date: Date,
            achieved_date: Date,
        },
    ],
    kpi_tracking: [
        {
            metric_name: {
                type: String,
                required: true,
            },
            value: {
                type: Number,
                required: true,
            },
            recorded_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    follow_on_rounds: [
        {
            round_type: String,
            date: Date,
            amount: Number,
            participated: Boolean,
            amount_invested: Number,
        },
    ],
    exit_details: {
        exit_type: {
            type: String,
            enum: ['ipo', 'acquisition', 'secondary-sale', 'buyback'],
        },
        exit_date: Date,
        exit_valuation: Number,
        proceeds: Number,
        multiple: Number,
        irr: Number,
    },
    risk_assessment: {
        risk_level: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        risk_factors: [String],
        last_assessed: Date,
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
            },
            created_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'portfolios',
});
PortfolioSchema.index({ investor_id: 1, 'current_status.status': 1 });
PortfolioSchema.index({ startup_id: 1, investor_id: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Portfolio', PortfolioSchema);
//# sourceMappingURL=Portfolio.js.map