"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandPermission = void 0;
exports.brandPermission = {
    createAllowedRoles: () => ["Admin", "Employee"],
    readAllowedRoles: () => ["*"],
    updateAllowedRoles: () => ["Admin", "Employee"],
    deleteAllowedRoles: () => ["Admin"],
};
