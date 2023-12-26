import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const orderPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner", "User"],

  readAllowedRoles: () => ["Admin", "Shopowner", "User"],

  updateAllowedRoles: () => ["Admin", "Shopowner"],

  deleteAllowedRoles: () => ["Admin"],
}

