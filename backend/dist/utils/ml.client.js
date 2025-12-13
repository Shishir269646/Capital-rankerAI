"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlClient = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
exports.mlClient = axios_1.default.create({
    baseURL: (0, env_1.getEnv)('ML_SERVICE_URL', 'http://localhost:8000'),
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});
//# sourceMappingURL=ml.client.js.map