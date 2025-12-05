// src/model/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  firm_name: string;
  role: 'admin' | 'investor' | 'analyst';
  preferences: {
    notification_channels: ('email' | 'slack' | 'teams')[];
    alert_types: string[];
    dashboard_layout: object;
    scoring_weights: {
      market_weight: number;
      traction_weight: number;
      team_weight: number;
      financial_weight: number;
    };
  };
  profile_picture?: string;
  phone?: string;
  linkedin_url?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    firm_name: {
      type: String,
      required: [true, 'Firm name is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['admin', 'investor', 'analyst'],
      default: 'analyst',
      required: true,
    },
    preferences: {
      notification_channels: {
        type: [String],
        enum: ['email', 'slack', 'teams'],
        default: ['email'],
      },
      alert_types: {
        type: [String],
        default: ['competitive_threat', 'market_shift', 'portfolio_anomaly'],
      },
      dashboard_layout: {
        type: Schema.Types.Mixed,
        default: {},
      },
      scoring_weights: {
        market_weight: { type: Number, default: 0.3, min: 0, max: 1 },
        traction_weight: { type: Number, default: 0.25, min: 0, max: 1 },
        team_weight: { type: Number, default: 0.25, min: 0, max: 1 },
        financial_weight: { type: Number, default: 0.2, min: 0, max: 1 },
      },
    },
    profile_picture: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'],
    },
    linkedin_url: {
      type: String,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    last_login: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  }
);

// Index for better query performance
UserSchema.index({ email: 1, firm_name: 1 });
UserSchema.index({ role: 1, is_active: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  } catch (error) {
    return false;
  }
};

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  delete obj.__v;
  return obj;
};

export default mongoose.model<IUser>('User', UserSchema);
