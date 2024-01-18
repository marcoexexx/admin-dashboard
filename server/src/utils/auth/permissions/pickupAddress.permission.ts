import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";


export const pickupAddressPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin", "Shopowner", "User"],

  readAllowedRoles: () => ["Admin", "Shopowner", "User"],

  updateAllowedRoles: () => [],

  deleteAllowedRoles: () => ["Admin", "Shopowner", "User"],
}

