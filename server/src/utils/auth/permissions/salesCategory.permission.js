"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesCategoryPermission = void 0;
exports.salesCategoryPermission = {
    createAllowedRoles: () => ["Admin", "Employee"],
    readAllowedRoles: () => ["*"],
    updateAllowedRoles: () => ["Admin", "Employee"],
    deleteAllowedRoles: () => ["Admin"],
};
