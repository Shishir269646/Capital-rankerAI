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
const AlertSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            'competitive_threat',
            'market_shift',
            'portfolio_anomaly',
            'funding_round',
            'regulatory_change',
            'custom',
        ],
        index: true,
    },
    title: {
        type: String,
        required: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'critical'],
        index: true,
    },
    status: {
        type: String,
        default: 'unread',
        enum: ['unread', 'read', 'archived'],
        index: true,
    },
    related_entities: {
        startup_ids: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Startup',
            },
        ],
        portfolio_ids: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Portfolio',
            },
        ],
    },
    data: mongoose_1.Schema.Types.Mixed,
    action_required: {
        type: Boolean,
        default: false,
    },
    action_url: String,
    triggered_at: {
        type: Date,
        default: Date.now,
        index: true,
    },
    read_at: Date,
    expires_at: {
        type: Date,
        index: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'alerts',
});
AlertSchema.index({ user_id: 1, status: 1, triggered_at: -1 });
AlertSchema.index({ user_id: 1, type: 1, status: 1 });
exports.default = mongoose_1.default.model('Alert', AlertSchema);
//# sourceMappingURL=Alert.js.map