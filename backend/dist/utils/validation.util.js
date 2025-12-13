"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_util_1 = require("./error.util");
const validate = (schema) => {
    return (req, _res, next) => {
        const validationTarget = { ...req.body, ...req.query, ...req.params };
        const { error } = schema.validate(validationTarget, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const details = error.details.map((d) => d.message).join(', ');
            return next(new error_util_1.CustomError(400, `Validation Error: ${details}`));
        }
        next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.util.js.map