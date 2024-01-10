import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";


export const userAddressPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner", "User"],

  readAllowedRoles: () => ["Admin", "Shopowner", "User"],

  updateAllowedRoles: () => ["Admin", "Shopowner", "User"],

  deleteAllowedRoles: () => ["Admin", "Shopowner", "User"],
}
