import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";


export const potentialOrderPermission: Permission<Role> = {
  createAllowedRoles: () => ["*"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["*"],

  deleteAllowedRoles: () => ["Admin", "Shopowner", "User"],
}
