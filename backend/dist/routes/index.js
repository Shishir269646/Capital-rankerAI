"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./v1/auth.routes"));
const deal_routes_1 = __importDefault(require("./v1/deal.routes"));
const scoring_routes_1 = __importDefault(require("./v1/scoring.routes"));
const thesis_routes_1 = require("./v1/thesis.routes");
const founder_routes_1 = require("./v1/founder.routes");
const alert_routes_1 = require("./v1/alert.routes");
const portfolio_routes_1 = require("./v1/portfolio.routes");
const report_routes_1 = require("./v1/report.routes");
const router = (0, express_1.Router)();
router.use('/v1/auth', auth_routes_1.default);
router.use('/v1/deals', deal_routes_1.default);
router.use('/v1/scoring', scoring_routes_1.default);
router.use('/v1/thesis', thesis_routes_1.thesisRouter);
router.use('/v1/founders', founder_routes_1.founderRouter);
router.use('/v1/alerts', alert_routes_1.alertRouter);
router.use('/v1/portfolio', portfolio_routes_1.portfolioRouter);
router.use('/v1/reports', report_routes_1.reportRouter);
exports.default = router;
//# sourceMappingURL=index.js.map