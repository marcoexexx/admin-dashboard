"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const brand_schema_1 = require("../schemas/brand.schema");
const brand_controller_1 = require("../controllers/brand.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const permissionUser_1 = require("../middleware/permissionUser");
const brand_permission_1 = require("../utils/auth/permissions/brand.permission");
const router = (0, express_1.Router)();
router.route("")
    .get((0, permissionUser_1.permissionUser)("read", brand_permission_1.brandPermission), brand_controller_1.getBrandsHandler)
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", brand_permission_1.brandPermission), (0, validate_1.validate)(brand_schema_1.createBrandSchema), brand_controller_1.createBrandHandler);
router.route("/multi")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", brand_permission_1.brandPermission), (0, validate_1.validate)(brand_schema_1.createMultiBrandsSchema), brand_controller_1.createMultiBrandsHandler);
router.route("/detail/:brandId")
    .get((0, permissionUser_1.permissionUser)("read", brand_permission_1.brandPermission), (0, validate_1.validate)(brand_schema_1.getBrandSchema), brand_controller_1.getBrandHandler)
    .patch(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("update", brand_permission_1.brandPermission), (0, validate_1.validate)(brand_schema_1.updateBrandSchema), brand_controller_1.updateBrandHandler)
    .delete(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, validate_1.validate)(brand_schema_1.getBrandSchema), (0, permissionUser_1.permissionUser)("delete", brand_permission_1.brandPermission), brand_controller_1.deleteBrandHandler);
exports.default = router;
