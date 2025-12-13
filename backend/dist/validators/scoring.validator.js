"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareScoresValidator = exports.batchScoreValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.batchScoreValidator = joi_1.default.object({
    deal_ids: joi_1.default.array()
        .items(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .max(50)
        .required()
        .messages({
        'array.min': 'At least one deal ID is required',
        'array.max': 'Cannot score more than 50 deals at once',
        'string.pattern.base': 'Invalid deal ID format',
    }),
});
exports.compareScoresValidator = joi_1.default.object({
    deal_ids: joi_1.default.array()
        .items(joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(2)
        .max(10)
        .required()
        .messages({
        'array.min': 'At least 2 deal IDs are required for comparison',
        'array.max': 'Cannot compare more than 10 deals at once',
    }),
});
//# sourceMappingURL=scoring.validator.js.map