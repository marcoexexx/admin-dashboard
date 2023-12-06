"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const user_controller_1 = require("../controllers/user.controller");
const user_schema_1 = require("../schemas/user.schema");
const validate_1 = require("../middleware/validate");
const onlyAdminUser_1 = require("../middleware/onlyAdminUser");
const permissionUser_1 = require("../middleware/permissionUser");
const permissions_1 = require("../utils/auth/permissions");
const router = (0, express_1.Router)();
router.use(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser);
router.route("")
    .get((0, permissionUser_1.permissionUser)("read", permissions_1.userPermission), user_controller_1.getUsersHandler);
router.route("/profile/:username")
    .get((0, permissionUser_1.permissionUser)("read", permissions_1.userPermission), (0, validate_1.validate)(user_schema_1.getUserByUsernameSchema), user_controller_1.getUserByUsernameHandler);
router.route("/detail/:userId")
    .get((0, permissionUser_1.permissionUser)("read", permissions_1.userPermission), (0, validate_1.validate)(user_schema_1.getUserSchema), user_controller_1.getUserHandler);
router.route("/change-role/:userId")
    .patch(onlyAdminUser_1.onlyAdminUser, (0, permissionUser_1.permissionUser)("update", permissions_1.userPermission), (0, validate_1.validate)(user_schema_1.changeUserRoleSchema), user_controller_1.changeUserRoleHandler);
exports.default = router;
