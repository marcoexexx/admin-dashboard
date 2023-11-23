import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const salesCategoryPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Employee"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["Admin", "Employee"],

  deleteAllowedRoles: () => ["Admin"],
}


