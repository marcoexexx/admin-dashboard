import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const dashboardPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin"],

  readAllowedRoles: () => ["Admin", "Shopowner"],

  updateAllowedRoles: () => ["Admin"],

  deleteAllowedRoles: () => ["Admin"],
}
