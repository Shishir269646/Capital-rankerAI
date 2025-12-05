// src/model/Founder.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IFounder extends Document {
  name: string;
  email?: string;
  role: 'ceo' | 'cto' | 'coo' | 'cfo' | 'co-founder' | 'founder';
  startup_id: mongoose.Types.ObjectId;
  profile: {
    bio: string;
    linkedin_url?: string;
    twitter_url?: string;
    github_url?: string;
    profile_picture?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    start_year: number;
    end_year?: number;
    is_graduated: boolean;
  }>;
  experience: Array<{
    company: string;
    title: string;
    description?: string;
    start_date: Date;
    end_date?: Date;
    is_current: boolean;
    achievements: string[];
  }>;
  skills: {
    technical_skills: string[];
    domain_expertise: string[];
    leadership_experience: boolean;
    years_of_experience: number;
  };
  previous_startups: Array<{
    name: string;
    role: string;
    outcome: 'exit' | 'active' | 'failed' | 'acquired';
    exit_value?: number;
    description?: string;
  }>;
  achievements: string[];
  publications?: string[];
  patents?: string[];
  awards?: string[];
  founder_score?: {
    overall_score: number; // 0-100
    experience_score: number;
    education_score: number;
    track_record_score: number;
    leadership_score: number;
    adaptability_score: number;
    domain_expertise_score: number;
    scored_at: Date;
  };
  red_flags: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    detected_at: Date;
  }>;
  references: Array<{
    name: string;
    relationship: string;
    contact?: string;
    verified: boolean;
    notes?: string;
  }>;
  last_synced?: Date;
  created_at: Date;
  updated_at: Date;
}

const FounderSchema: Schema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'founders',
  }
);

// Indexes
FounderSchema.index({ startup_id: 1, role: 1 });
FounderSchema.index({ name: 'text', 'profile.bio': 'text' });
FounderSchema.index({ 'founder_score.overall_score': -1 });

// Virtual for total years of experience
FounderSchema.virtual('total_experience_years').get(function () {
  return this.experience.reduce((total: number, exp: any) => {
    const endDate = exp.end_date || new Date();
    const years = (endDate.getTime() - exp.start_date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return total + years;
  }, 0);
});

// Virtual for successful exits count
FounderSchema.virtual('successful_exits_count').get(function () {
  return this.previous_startups.filter(
    (startup: any) => startup.outcome === 'exit' || startup.outcome === 'acquired'
  ).length;
});

// Virtual for has red flags
FounderSchema.virtual('has_critical_red_flags').get(function () {
  return this.red_flags.some((flag: any) => flag.severity === 'high');
});

// Enable virtuals
FounderSchema.set('toJSON', { virtuals: true });
FounderSchema.set('toObject', { virtuals: true });

export default mongoose.model<IFounder>('Founder', FounderSchema);
