import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const accessLogPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Employee", "User"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => [],

  deleteAllowedRoles: () => ["User", "Employee", "Admin"],
}



