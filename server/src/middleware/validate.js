"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const helper_1 = require("../utils/helper");
function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(422).json((0, helper_1.HttpResponse)(422, "invalid input", err.errors));
            }
            next(err);
        }
    };
}
exports.validate = validate;
