"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.founderRouter = void 0;
const express_1 = require("express");
const founder_controller_1 = require("../../controllers/founder.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const founder_validator_1 = require("../../validators/founder.validator");
const founderRouter = (0, express_1.Router)();
exports.founderRouter = founderRouter;
founderRouter.use(auth_middleware_1.authMiddleware);
founderRouter.post('/evaluate/:founderId', founder_controller_1.founderController.evaluateFounder.bind(founder_controller_1.founderController));
founderRouter.get('/:id', founder_controller_1.founderController.getFounderProfile.bind(founder_controller_1.founderController));
founderRouter.get('/startup/:startupId', founder_controller_1.founderController.getFoundersByStartup.bind(founder_controller_1.founderController));
founderRouter.put('/:id', (0, validation_middleware_1.validateRequest)(founder_validator_1.updateFounderValidator), founder_controller_1.founderController.updateFounder.bind(founder_controller_1.founderController));
//# sourceMappingURL=founder.routes.js.map