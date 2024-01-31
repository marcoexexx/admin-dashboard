import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const accessLogPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner", "User"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => [],

  deleteAllowedRoles: () => ["User"],
}
