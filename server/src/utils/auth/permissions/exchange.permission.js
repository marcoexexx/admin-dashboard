"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangePermission = void 0;
exports.exchangePermission = {
    createAllowedRoles: () => ["Admin", "Employee"],
    readAllowedRoles: () => ["Admin", "Employee", "User"],
    updateAllowedRoles: () => ["Admin", "Employee"],
    deleteAllowedRoles: () => ["Admin"],
};
