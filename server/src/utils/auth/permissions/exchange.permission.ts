import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const exchangePermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Employee"],

  readAllowedRoles: () => ["Admin", "Employee", "User"],

  updateAllowedRoles: () => ["Admin", "Employee"],

  deleteAllowedRoles: () => ["Admin"],
}

