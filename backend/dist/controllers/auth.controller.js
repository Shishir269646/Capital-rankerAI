"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
const ActivityLog_1 = __importDefault(require("../model/ActivityLog"));
class AuthController {
    async register(req, res, next) {
        try {
            const { email, password, name, firm_name, role } = req.body;
            const existingUser = await auth_service_1.authService.findUserByEmail(email);
            if (existingUser) {
                res.status(400).json((0, response_util_1.errorResponse)('User with this email already exists', 400));
                return;
            }
            const user = await auth_service_1.authService.registerUser({
                email,
                password,
                name,
                firm_name,
                role: role || 'analyst',
            });
            const tokens = auth_service_1.authService.generateTokens(user._id.toString());
            await auth_service_1.authService.saveRefreshToken(user._id.toString(), tokens.refresh.token);
            await ActivityLog_1.default.create({
                user_id: user._id,
                action: 'create',
                entity_type: 'user',
                entity_id: user._id,
                details: { email, firm_name },
                ip_address: req.ip,
                user_agent: req.headers['user-agent'],
            });
            res.status(201).json((0, response_util_1.successResponse)('User registered successfully', {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    firm_name: user.firm_name,
                    role: user.role,
                },
                tokens,
            }, 201));
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log("email", email);
            console.log("password", password);
            const user = await auth_service_1.authService.findUserByEmailWithPassword(email);
            if (!user) {
                res.status(401).json((0, response_util_1.errorResponse)('Invalid email or password', 401));
                return;
            }
            if (!user.is_active) {
                res.status(403).json((0, response_util_1.errorResponse)('Account is deactivated. Please contact support.', 403));
                return;
            }
            const isPasswordValid = await user.comparePassword(password);
            console.log("valid", isPasswordValid);
            if (!isPasswordValid) {
                res.status(401).json((0, response_util_1.errorResponse)('Invalid email or password', 401));
                return;
            }
            const tokens = auth_service_1.authService.generateTokens(user._id.toString());
            await auth_service_1.authService.saveRefreshToken(user._id.toString(), tokens.refresh.token);
            user.last_login = new Date();
            await user.save();
            await ActivityLog_1.default.create({
                user_id: user._id,
                action: 'login',
                entity_type: 'user',
                entity_id: user._id,
                ip_address: req.ip,
                user_agent: req.headers['user-agent'],
            });
            res.status(200).json((0, response_util_1.successResponse)('Login successful', {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    firm_name: user.firm_name,
                    role: user.role,
                    last_login: user.last_login,
                },
                tokens,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const { refresh_token } = req.body;
            if (!refresh_token) {
                res.status(400).json((0, response_util_1.errorResponse)('Refresh token is required', 400));
                return;
            }
            const decoded = auth_service_1.authService.verifyRefreshToken(refresh_token);
            if (!decoded) {
                res.status(401).json((0, response_util_1.errorResponse)('Invalid or expired refresh token', 401));
                return;
            }
            const storedToken = await auth_service_1.authService.getRefreshToken(decoded.userId);
            if (storedToken !== refresh_token) {
                res.status(401).json((0, response_util_1.errorResponse)('Invalid refresh token', 401));
                return;
            }
            const newAccessToken = auth_service_1.authService.generateAccessToken(decoded.userId);
            res.status(200).json((0, response_util_1.successResponse)('Token refreshed successfully', {
                access_token: newAccessToken,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            await auth_service_1.authService.deleteRefreshToken(userId);
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                await auth_service_1.authService.blacklistToken(token);
            }
            await ActivityLog_1.default.create({
                user_id: userId,
                action: 'logout',
                entity_type: 'user',
                entity_id: userId,
                ip_address: req.ip,
                user_agent: req.headers['user-agent'],
            });
            res.status(200).json((0, response_util_1.successResponse)('Logout successful'));
        }
        catch (error) {
            next(error);
        }
    }
    async getCurrentUser(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const user = await auth_service_1.authService.findUserById(userId);
            if (!user) {
                res.status(404).json((0, response_util_1.errorResponse)('User not found', 404));
                return;
            }
            res.status(200).json((0, response_util_1.successResponse)('User profile retrieved', {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    firm_name: user.firm_name,
                    role: user.role,
                    preferences: user.preferences,
                    profile_picture: user.profile_picture,
                    phone: user.phone,
                    linkedin_url: user.linkedin_url,
                    is_active: user.is_active,
                    last_login: user.last_login,
                    created_at: user.created_at,
                },
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async updatePreferences(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const preferences = req.body;
            const updatedUser = await auth_service_1.authService.updateUserPreferences(userId, preferences);
            res.status(200).json((0, response_util_1.successResponse)('Preferences updated successfully', {
                preferences: updatedUser.preferences,
            }));
        }
        catch (error) {
            next(error);
        }
    }
    async changePassword(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return next((0, response_util_1.errorResponse)('User not authenticated', 401));
            }
            const { current_password, new_password } = req.body;
            const user = await auth_service_1.authService.findUserByIdWithPassword(userId);
            if (!user) {
                res.status(404).json((0, response_util_1.errorResponse)('User not found', 404));
                return;
            }
            const isPasswordValid = await user.comparePassword(current_password);
            if (!isPasswordValid) {
                res.status(401).json((0, response_util_1.errorResponse)('Current password is incorrect', 401));
                return;
            }
            user.password = new_password;
            await user.save();
            await auth_service_1.authService.deleteRefreshToken(userId);
            res.status(200).json((0, response_util_1.successResponse)('Password changed successfully'));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map