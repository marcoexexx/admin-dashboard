"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const validate_1 = require("../middleware/validate");
const permissionUser_1 = require("../middleware/permissionUser");
const product_controller_1 = require("../controllers/product.controller");
const product_schema_1 = require("../schemas/product.schema");
const permissions_1 = require("../utils/auth/permissions");
const multiUpload_1 = require("../upload/multiUpload");
const exchange_schema_1 = require("../schemas/exchange.schema");
const exchange_controller_1 = require("../controllers/exchange.controller");
const router = (0, express_1.Router)();
router.route("")
    .get((0, permissionUser_1.permissionUser)("read", permissions_1.productPermission), product_controller_1.getProductsHandler)
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", permissions_1.productPermission), (0, validate_1.validate)(product_schema_1.createProductSchema), product_controller_1.createProductHandler);
router.route("/multi")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", permissions_1.productPermission), (0, validate_1.validate)(exchange_schema_1.createMultiExchangesSchema), exchange_controller_1.createMultiExchangesHandler);
router.route("/detail/:productId")
    .get((0, validate_1.validate)(product_schema_1.getProductSchema), product_controller_1.getProductHandler)
    .delete(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("delete", permissions_1.productPermission), (0, validate_1.validate)(product_schema_1.getProductSchema), product_controller_1.deleteProductHandler)
    .patch(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("update", permissions_1.productPermission), (0, validate_1.validate)(product_schema_1.updateProductSchema), product_controller_1.updateProductHandler);
router.route("/upload/:productId")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("update", permissions_1.productPermission), multiUpload_1.uploadProductImage, multiUpload_1.resizeProductImages, (0, validate_1.validate)(product_schema_1.getProductSchema), (0, validate_1.validate)(product_schema_1.uploadImagesProductSchema), product_controller_1.uploadImagesProductHandler);
exports.default = router;
