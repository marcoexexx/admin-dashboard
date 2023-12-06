"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productPermission = void 0;
exports.productPermission = {
    createAllowedRoles: () => ["Admin", "Employee"],
    readAllowedRoles: () => ["*"],
    updateAllowedRoles: () => ["Admin", "Employee"],
    deleteAllowedRoles: () => ["Admin", "Employee"],
};
