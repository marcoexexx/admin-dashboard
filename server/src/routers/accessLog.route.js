"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const permissionUser_1 = require("../middleware/permissionUser");
const accessLog_permission_1 = require("../utils/auth/permissions/accessLog.permission");
const accessLog_controller_1 = require("../controllers/accessLog.controller");
const router = (0, express_1.Router)();
router.use(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser);
router.route("")
    .get((0, permissionUser_1.permissionUser)("read", accessLog_permission_1.accessLogPermission), accessLog_controller_1.getAccessLogsHandler);
router.route("")
    .get((0, permissionUser_1.permissionUser)("delete", accessLog_permission_1.accessLogPermission), accessLog_controller_1.deleteAccessLogsHandler);
exports.default = router;
