"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleBasedAccess = void 0;
function createRoleBasedAccess() {
    return {
        isAuthenticated(permission, role, action) {
            let access = false;
            let perms = [];
            switch (action) {
                case "create":
                    perms = [...perms, ...permission.createAllowedRoles()];
                    break;
                case "read":
                    perms = [...perms, ...permission.readAllowedRoles()];
                    break;
                case "update":
                    perms = [...perms, ...permission.updateAllowedRoles()];
                    break;
                case "delete":
                    perms = [...perms, ...permission.deleteAllowedRoles()];
                    break;
                default:
                    console.warn("Unreachable");
                    throw new Error("must be in `create`, `read`, `update` and `delete`");
            }
            if (perms.includes("*"))
                access = true;
            else if (perms.includes(role))
                access = true;
            else
                access = false;
            return access;
        }
    };
}
exports.createRoleBasedAccess = createRoleBasedAccess;
