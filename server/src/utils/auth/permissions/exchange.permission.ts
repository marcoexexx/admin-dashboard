import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const exchangePermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner"],

  readAllowedRoles: () => ["Admin", "Shopowner", "User"],

  updateAllowedRoles: () => ["Admin", "Shopowner"],

  deleteAllowedRoles: () => ["Admin"],
}

