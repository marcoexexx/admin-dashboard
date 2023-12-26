import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const couponPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["Admin", "Shopowner"],

  deleteAllowedRoles: () => ["Admin", "Shopowner"],
}
