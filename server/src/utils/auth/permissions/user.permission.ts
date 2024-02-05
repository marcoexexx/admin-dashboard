import { Role } from "../../../schemas/user.schema";
import { Permission } from "../rbac";


export const userPermission: Permission<Role> = {
  createAllowedRoles: () => ["Admin"],

  readAllowedRoles: () => ["*"],

  updateAllowedRoles: () => ["Admin"],

  deleteAllowedRoles: () => ["Admin"],
}
