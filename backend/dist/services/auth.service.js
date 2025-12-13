"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
const cache_service_1 = require("./cache.service");
const jwt_decode_1 = require("jwt-decode");
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
        this.JWT_EXPIRE = process.env.JWT_EXPIRE || '1d';
        this.REFRESH_EXPIRE = '7d';
        this.TOKEN_BLACKLIST_PREFIX = 'blacklist:';
        this.REFRESH_TOKEN_PREFIX = 'refresh:';
    }
    async registerUser(userData) {
        const user = new User_1.default({
            email: userData.email,
            password: userData.password,
            name: userData.name,
            firm_name: userData.firm_name,
            role: userData.role || 'analyst',
        });
        await user.save();
        return user;
    }
    async findUserByEmail(email) {
        return (await User_1.default.findOne({ email, is_active: true }));
    }
    async findUserByEmailWithPassword(email) {
        return (await User_1.default.findOne({ email, is_active: true }).select('+password'));
    }
    async findUserById(userId) {
        return (await User_1.default.findById(userId));
    }
    async findUserByIdWithPassword(userId) {
        return (await User_1.default.findById(userId).select('+password'));
    }
    generateAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, type: 'access' }, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRE,
        });
    }
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, type: 'refresh' }, this.REFRESH_SECRET, {
            expiresIn: this.REFRESH_EXPIRE,
        });
    }
    generateTokens(userId) {
        const accessToken = this.generateAccessToken(userId);
        const refreshToken = this.generateRefreshToken(userId);
        const decodedAccess = (0, jwt_decode_1.jwtDecode)(accessToken);
        const decodedRefresh = (0, jwt_decode_1.jwtDecode)(refreshToken);
        return {
            access: {
                token: accessToken,
                expires: new Date(decodedAccess.exp * 1000),
            },
            refresh: {
                token: refreshToken,
                expires: new Date(decodedRefresh.exp * 1000),
            },
        };
    }
    verifyAccessToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            if (decoded.type !== 'access') {
                return null;
            }
            return { userId: decoded.userId };
        }
        catch (error) {
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.REFRESH_SECRET);
            if (decoded.type !== 'refresh') {
                return null;
            }
            return { userId: decoded.userId };
        }
        catch (error) {
            return null;
        }
    }
    async saveRefreshToken(userId, token) {
        const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
        const expirySeconds = 7 * 24 * 60 * 60;
        await cache_service_1.cacheService.set(key, token, expirySeconds);
    }
    async getRefreshToken(userId) {
        const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
        return await cache_service_1.cacheService.get(key);
    }
    async deleteRefreshToken(userId) {
        const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
        await cache_service_1.cacheService.delete(key);
    }
    async blacklistToken(token) {
        const key = `${this.TOKEN_BLACKLIST_PREFIX}${token}`;
        const expirySeconds = 24 * 60 * 60;
        await cache_service_1.cacheService.set(key, 'blacklisted', expirySeconds);
    }
    async isTokenBlacklisted(token) {
        const key = `${this.TOKEN_BLACKLIST_PREFIX}${token}`;
        const value = await cache_service_1.cacheService.get(key);
        return value === 'blacklisted';
    }
    async updateUserPreferences(userId, preferences) {
        const user = await User_1.default.findByIdAndUpdate(userId, { $set: { preferences } }, { new: true, runValidators: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    validatePasswordStrength(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    generatePasswordResetToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, type: 'password-reset' }, this.JWT_SECRET, { expiresIn: '1h' });
    }
    verifyPasswordResetToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            if (decoded.type !== 'password-reset') {
                return null;
            }
            return { userId: decoded.userId };
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map