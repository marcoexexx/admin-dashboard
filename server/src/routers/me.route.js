"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requiredUser_1 = require("../middleware/requiredUser");
const user_controller_1 = require("../controllers/user.controller");
const singleUpload_1 = require("../upload/singleUpload");
const validate_1 = require("../middleware/validate");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
router.use(deserializeUser_1.deserializeUser, requiredUser_1.requiredUser);
router.route("/")
    .get(user_controller_1.getMeHandler);
router.route("/profile")
    .get(user_controller_1.getMeProfileHandler);
// router
//   .route("/change-password")
router.route("/upload/profile-picture")
    .post(singleUpload_1.uploadProfileImage, singleUpload_1.resizeProfileImage, (0, validate_1.validate)(user_schema_1.uploadImageProfileSchema), user_controller_1.uploadImageProfileHandler);
router.route("/upload/cover-photo")
    .post(singleUpload_1.uploadProfileImage, singleUpload_1.resizeProfileImage, (0, validate_1.validate)(user_schema_1.uploadImageProfileSchema), user_controller_1.uploadImageCoverHandler);
exports.default = router;
