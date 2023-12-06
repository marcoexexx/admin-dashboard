"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessLogPermission = void 0;
exports.accessLogPermission = {
    createAllowedRoles: () => ["Admin", "Employee", "User"],
    readAllowedRoles: () => ["*"],
    updateAllowedRoles: () => [],
    deleteAllowedRoles: () => ["User", "Employee", "Admin"],
};
