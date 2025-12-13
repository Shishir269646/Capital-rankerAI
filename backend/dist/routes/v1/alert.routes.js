"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertRouter = void 0;
const express_1 = require("express");
const alert_controller_1 = require("../../controllers/alert.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const alert_validator_1 = require("../../validators/alert.validator");
const alertRouter = (0, express_1.Router)();
exports.alertRouter = alertRouter;
alertRouter.use(auth_middleware_1.authMiddleware);
alertRouter.get('/', alert_controller_1.alertController.getAlerts.bind(alert_controller_1.alertController));
alertRouter.post('/configure', (0, validation_middleware_1.validateRequest)(alert_validator_1.configureAlertsValidator), alert_controller_1.alertController.configureAlerts.bind(alert_controller_1.alertController));
alertRouter.put('/:id/read', alert_controller_1.alertController.markAsRead.bind(alert_controller_1.alertController));
alertRouter.delete('/:id', alert_controller_1.alertController.deleteAlert.bind(alert_controller_1.alertController));
//# sourceMappingURL=alert.routes.js.map