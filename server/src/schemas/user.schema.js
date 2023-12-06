"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageProfileSchema = exports.changeUserRoleSchema = exports.getUserByUsernameSchema = exports.getUserSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const params = {
    params: (0, zod_1.object)({
        userId: (0, zod_1.string)({ required_error: "User ID is required" })
    })
};
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Username is required" })
            .min(1)
            .max(128),
        email: (0, zod_1.string)({ required_error: "Email is required" })
            .email(),
        password: (0, zod_1.string)({ required_error: "Password id required" })
            .min(8)
            .max(32),
        passwordConfirm: (0, zod_1.string)({ required_error: "Please confirm your password" })
    }).refine(data => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "Password do not match"
    })
});
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({ required_error: "Email is required" })
            .email(),
        password: (0, zod_1.string)({ required_error: "Password id required" })
    })
});
exports.getUserSchema = (0, zod_1.object)(Object.assign({}, params));
exports.getUserByUsernameSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        username: (0, zod_1.string)({ required_error: "Username is required" })
    })
});
exports.changeUserRoleSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), { body: (0, zod_1.object)({
        role: zod_1.z.enum(["Admin", "User", "Employee"], { required_error: "User role is required" })
    }) }));
exports.uploadImageProfileSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        image: (0, zod_1.string)({ required_error: "Image is required" }),
    })
});
