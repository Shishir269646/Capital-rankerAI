"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_validator_1 = require("../../validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_middleware_1.validateRequest)(auth_validator_1.registerValidator), auth_controller_1.authController.register.bind(auth_controller_1.authController));
router.post('/login', (0, validation_middleware_1.validateRequest)(auth_validator_1.loginValidator), auth_controller_1.authController.login.bind(auth_controller_1.authController));
router.post('/refresh-token', (0, validation_middleware_1.validateRequest)(auth_validator_1.refreshTokenValidator), auth_controller_1.authController.refreshToken.bind(auth_controller_1.authController));
router.post('/logout', auth_middleware_1.authMiddleware, auth_controller_1.authController.logout.bind(auth_controller_1.authController));
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.authController.getCurrentUser.bind(auth_controller_1.authController));
router.put('/preferences', auth_middleware_1.authMiddleware, (0, validation_middleware_1.validateRequest)(auth_validator_1.updatePreferencesValidator), auth_controller_1.authController.updatePreferences.bind(auth_controller_1.authController));
router.put('/change-password', auth_middleware_1.authMiddleware, (0, validation_middleware_1.validateRequest)(auth_validator_1.changePasswordValidator), auth_controller_1.authController.changePassword.bind(auth_controller_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map