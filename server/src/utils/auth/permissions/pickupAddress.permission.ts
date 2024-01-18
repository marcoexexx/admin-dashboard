import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const pickupAddressPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner", "User"],

  /* This is permission for all pickup addresses */
  readAllowedRoles: () => ["Admin"],  

  updateAllowedRoles: () => [],

  deleteAllowedRoles: () => ["Admin", "Shopowner", "User"],
}

