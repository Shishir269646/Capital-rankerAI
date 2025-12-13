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
const FounderSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Founder name is required'],
        trim: true,
        index: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    role: {
        type: String,
        required: [true, 'Founder role is required'],
        enum: ['ceo', 'cto', 'coo', 'cfo', 'co-founder', 'founder'],
        index: true,
    },
    startup_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Startup',
        required: [true, 'Startup ID is required'],
        index: true,
    },
    profile: {
        bio: {
            type: String,
            maxlength: [2000, 'Bio cannot exceed 2000 characters'],
        },
        linkedin_url: {
            type: String,
            trim: true,
        },
        twitter_url: {
            type: String,
            trim: true,
        },
        github_url: {
            type: String,
            trim: true,
        },
        profile_picture: {
            type: String,
            trim: true,
        },
    },
    education: [
        {
            institution: {
                type: String,
                required: true,
                trim: true,
            },
            degree: {
                type: String,
                required: true,
                enum: ['high-school', 'bachelor', 'master', 'phd', 'mba', 'other'],
            },
            field_of_study: {
                type: String,
                required: true,
                trim: true,
            },
            start_year: {
                type: Number,
                required: true,
                min: 1950,
                max: new Date().getFullYear(),
            },
            end_year: {
                type: Number,
                min: 1950,
                max: new Date().getFullYear() + 10,
            },
            is_graduated: {
                type: Boolean,
                default: true,
            },
        },
    ],
    experience: [
        {
            company: {
                type: String,
                required: true,
                trim: true,
            },
            title: {
                type: String,
                required: true,
                trim: true,
            },
            description: {
                type: String,
                maxlength: 1000,
            },
            start_date: {
                type: Date,
                required: true,
            },
            end_date: {
                type: Date,
            },
            is_current: {
                type: Boolean,
                default: false,
            },
            achievements: {
                type: [String],
                default: [],
            },
        },
    ],
    skills: {
        technical_skills: {
            type: [String],
            default: [],
        },
        domain_expertise: {
            type: [String],
            default: [],
            index: true,
        },
        leadership_experience: {
            type: Boolean,
            default: false,
        },
        years_of_experience: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    previous_startups: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            role: {
                type: String,
                required: true,
            },
            outcome: {
                type: String,
                required: true,
                enum: ['exit', 'active', 'failed', 'acquired'],
            },
            exit_value: {
                type: Number,
                min: 0,
            },
            description: {
                type: String,
                maxlength: 500,
            },
        },
    ],
    achievements: {
        type: [String],
        default: [],
    },
    publications: {
        type: [String],
        default: [],
    },
    patents: {
        type: [String],
        default: [],
    },
    awards: {
        type: [String],
        default: [],
    },
    founder_score: {
        overall_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        experience_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        education_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        track_record_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        leadership_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        adaptability_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        domain_expertise_score: {
            type: Number,
            min: 0,
            max: 100,
        },
        scored_at: {
            type: Date,
        },
    },
    red_flags: [
        {
            type: {
                type: String,
                required: true,
                enum: [
                    'employment-gap',
                    'frequent-job-changes',
                    'failed-startup',
                    'legal-issues',
                    'reputation-concerns',
                    'skill-mismatch',
                    'other',
                ],
            },
            description: {
                type: String,
                required: true,
                maxlength: 500,
            },
            severity: {
                type: String,
                required: true,
                enum: ['low', 'medium', 'high'],
            },
            detected_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    references: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            relationship: {
                type: String,
                required: true,
                trim: true,
            },
            contact: {
                type: String,
                trim: true,
            },
            verified: {
                type: Boolean,
                default: false,
            },
            notes: {
                type: String,
                maxlength: 1000,
            },
        },
    ],
    last_synced: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'founders',
});
FounderSchema.index({ startup_id: 1, role: 1 });
FounderSchema.index({ name: 'text', 'profile.bio': 'text' });
FounderSchema.index({ 'founder_score.overall_score': -1 });
FounderSchema.virtual('total_experience_years').get(function () {
    return this.experience.reduce((total, exp) => {
        const endDate = exp.end_date || new Date();
        const years = (endDate.getTime() - exp.start_date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        return total + years;
    }, 0);
});
FounderSchema.virtual('successful_exits_count').get(function () {
    return this.previous_startups.filter((startup) => startup.outcome === 'exit' || startup.outcome === 'acquired').length;
});
FounderSchema.virtual('has_critical_red_flags').get(function () {
    return this.red_flags.some((flag) => flag.severity === 'high');
});
FounderSchema.set('toJSON', { virtuals: true });
FounderSchema.set('toObject', { virtuals: true });
exports.default = mongoose_1.default.model('Founder', FounderSchema);
//# sourceMappingURL=Founder.js.map