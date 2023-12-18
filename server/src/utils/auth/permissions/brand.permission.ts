import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const brandPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["Admin", "Shopowner"],

  deleteAllowedRoles: () => ["Admin"],
}


