"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardPermission = void 0;
exports.dashboardPermission = {
    createAllowedRoles: () => ["Admin"],
    readAllowedRoles: () => ["Admin", "Employee"],
    updateAllowedRoles: () => ["Admin"],
    deleteAllowedRoles: () => ["Admin"],
};
