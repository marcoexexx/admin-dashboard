import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";

export const userPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin"],

  readAllowedRoles: () => ["Admin"],

  updateAllowedRoles: () => ["Admin"],

  deleteAllowedRoles: () => ["Admin"],
}


