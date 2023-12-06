"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const permissionUser_1 = require("../middleware/permissionUser");
const category_permission_1 = require("../utils/auth/permissions/category.permission");
const category_controller_1 = require("../controllers/category.controller");
const validate_1 = require("../middleware/validate");
const category_schema_1 = require("../schemas/category.schema");
const router = (0, express_1.Router)();
router.route("")
    .get((0, permissionUser_1.permissionUser)("read", category_permission_1.categoryPermission), category_controller_1.getCategoriesHandler)
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", category_permission_1.categoryPermission), (0, validate_1.validate)(category_schema_1.createCategorySchema), category_controller_1.createCategoryHandler);
router.route("/multi")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", category_permission_1.categoryPermission), (0, validate_1.validate)(category_schema_1.createMultiCategoriesSchema), category_controller_1.createMultiCategoriesHandler);
router.route("/detail/:categoryId")
    .get((0, permissionUser_1.permissionUser)("read", category_permission_1.categoryPermission), (0, validate_1.validate)(category_schema_1.getCategorySchema), category_controller_1.getCategoryHandler)
    .patch(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("update", category_permission_1.categoryPermission), (0, validate_1.validate)(category_schema_1.updateCategorySchema), category_controller_1.updateCategoryHandler)
    .delete(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("delete", category_permission_1.categoryPermission), (0, validate_1.validate)(category_schema_1.getCategorySchema), category_controller_1.deleteCategoryHandler);
exports.default = router;
