"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionUser = void 0;
const logging_1 = __importDefault(require("./logging/logging"));
const appError_1 = __importDefault(require("../utils/appError"));
const permissions_1 = __importDefault(require("../utils/auth/permissions"));
function permissionUser(action, perm) {
    return (req, _, next) => {
        try {
            // @ts-ignore  for mocha testing
            const user = req.user;
            const isAllowed = permissions_1.default.isAuthenticated(perm, (user === null || user === void 0 ? void 0 : user.role) || "*", action);
            if (!isAllowed)
                return next(new appError_1.default(403, "You do not have permission to access this resource."));
            next();
        }
        catch (err) {
            const msg = (err === null || err === void 0 ? void 0 : err.message) || "internal server error";
            logging_1.default.error(msg);
            next(new appError_1.default(500, msg));
        }
    };
}
exports.permissionUser = permissionUser;
