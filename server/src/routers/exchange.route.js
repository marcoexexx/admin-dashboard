"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissionUser_1 = require("../middleware/permissionUser");
const exchange_permission_1 = require("../utils/auth/permissions/exchange.permission");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const validate_1 = require("../middleware/validate");
const exchange_schema_1 = require("../schemas/exchange.schema");
const exchange_controller_1 = require("../controllers/exchange.controller");
const router = (0, express_1.Router)();
router.route("")
    .get(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("read", exchange_permission_1.exchangePermission), exchange_controller_1.getExchangesHandler)
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", exchange_permission_1.exchangePermission), (0, validate_1.validate)(exchange_schema_1.createExchangeSchema), exchange_controller_1.createExchangeHandler);
router.route("/multi")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("create", exchange_permission_1.exchangePermission), (0, validate_1.validate)(exchange_schema_1.createMultiExchangesSchema), exchange_controller_1.createMultiExchangesHandler);
router.route("/detail/:exchangeId")
    .get(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("read", exchange_permission_1.exchangePermission), (0, validate_1.validate)(exchange_schema_1.getExchangeSchema), exchange_controller_1.getExchangeHandler)
    .patch(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, permissionUser_1.permissionUser)("update", exchange_permission_1.exchangePermission), (0, validate_1.validate)(exchange_schema_1.updateExchangeSchema), exchange_controller_1.updateExchangeHandler)
    .delete(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, (0, validate_1.validate)(exchange_schema_1.getExchangeSchema), (0, permissionUser_1.permissionUser)("delete", exchange_permission_1.exchangePermission), exchange_controller_1.deleteExchangeHandler);
exports.default = router;
