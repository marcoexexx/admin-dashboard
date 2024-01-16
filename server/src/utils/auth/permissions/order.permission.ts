import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";


export const orderPermission: Permission<Role> = {
  createAllowedRoles: () => ["*"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["*"],

  deleteAllowedRoles: () => ["Admin", "Shopowner", "User"],
}

