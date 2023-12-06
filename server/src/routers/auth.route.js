"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const user_schema_1 = require("../schemas/user.schema");
const auth_controller_1 = require("../controllers/auth.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const router = (0, express_1.Router)();
router.route("/register")
    .post((0, validate_1.validate)(user_schema_1.createUserSchema), auth_controller_1.registerUserHandler);
router.route("/login")
    .post((0, validate_1.validate)(user_schema_1.loginUserSchema), auth_controller_1.loginUserHandler);
router.route("/refresh").get(auth_controller_1.refreshTokenHandler);
router.route("/logout")
    .post(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser, auth_controller_1.logoutHandler);
router.route("/oauth/google").get(auth_controller_1.googleOAuthHandler);
exports.default = router;
