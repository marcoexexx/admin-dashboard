import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const productPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Employee"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["Admin", "Employee"],

  deleteAllowedRoles: () => ["Admin", "Employee"],
}

