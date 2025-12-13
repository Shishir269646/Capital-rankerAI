import mongoose, { Document } from 'mongoose';
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
        overall_score: number;
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
declare const _default: mongoose.Model<IFounder, {}, {}, {}, mongoose.Document<unknown, {}, IFounder> & IFounder & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Founder.d.ts.map