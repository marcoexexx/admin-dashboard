"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionUser_1 = require("../middleware/permissionUser");
const salesCategory_permission_1 = require("../utils/auth/permissions/salesCategory.permission");
const salesCategory_controller_1 = require("../controllers/salesCategory.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const validate_1 = require("../middleware/validate");
const salesCategory_schema_1 = require("../schemas/salesCategory.schema");
const router = (0, express_1.Router)();
router.route("")
    .get((0, permissionUser_1.permissionUser)("read", salesCategory_permission_1.salesCategoryPermission), salesCategory_controller_1.getSalesCategoriesHandler)
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", salesCategory_permission_1.salesCategoryPermission), (0, validate_1.validate)(salesCategory_schema_1.createSalesCategorySchema), salesCategory_controller_1.createSalesCategoryHandler);
router.route("/multi")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", salesCategory_permission_1.salesCategoryPermission), (0, validate_1.validate)(salesCategory_schema_1.createMultiSalesCategoriesSchema), salesCategory_controller_1.createMultiSalesCategoriesHandler);
router.route("/detail/:salesCategoryId")
    .get((0, permissionUser_1.permissionUser)("read", salesCategory_permission_1.salesCategoryPermission), (0, validate_1.validate)(salesCategory_schema_1.getSalesCategorySchema), salesCategory_controller_1.getSalesCategoryHandler)
    .patch(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("update", salesCategory_permission_1.salesCategoryPermission), (0, validate_1.validate)(salesCategory_schema_1.updateSalesCategorySchema), salesCategory_controller_1.updateSalesCategoryHandler)
    .delete(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("delete", salesCategory_permission_1.salesCategoryPermission), (0, validate_1.validate)(salesCategory_schema_1.getSalesCategorySchema), salesCategory_controller_1.deleteSalesCategoryHandler);
exports.default = router;
