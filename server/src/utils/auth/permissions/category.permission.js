"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryPermission = void 0;
exports.categoryPermission = {
    createAllowedRoles: () => ["Admin", "Employee"],
    readAllowedRoles: () => ["*"],
    updateAllowedRoles: () => ["Admin", "Employee"],
    deleteAllowedRoles: () => ["Admin"],
};
