import { Action, Authoritor, Permission } from "./common"

export function createRoleBasedAccess<R>(): Authoritor<R> {
  return {
    isAuthenticated(permission: Permission<R>, role: R, action: Action): boolean {
      let access = false;
      let perms: Array<R | "*"> = [];

      switch (action) {
        case "create":
          perms = [...perms, ...permission.createAllowedRoles()];
          break
        case "read":
          perms = [...perms, ...permission.readAllowedRoles()];
          break
        case "update":
          perms = [...perms, ...permission.updateAllowedRoles()];
          break
        case "delete":
          perms = [...perms, ...permission.deleteAllowedRoles()];
          break
        default:
          console.warn("Unreachable")
          throw new Error("must be in `create`, `read`, `update` and `delete`")
      }

      if (perms.includes("*")) access = true;
      else if (perms.includes(role)) access = true;
      else access = false;

      return access
    }
  }
}
