import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { changeUserRoleHandler, createBlockUserHandler, getUserByUsernameHandler, getUserHandler, getUsersHandler, removeBlockedUserHandler } from "../controllers/user.controller";
import { getUserByUsernameSchema, getUserSchema, updateUserSchema } from "../schemas/user.schema";
import { validate } from "../middleware/validate";
import { onlyAdminUser } from "../middleware/onlyAdminUser";
import { permissionUser } from "../middleware/permissionUser";
import { userPermission } from "../utils/auth/permissions";

const router = Router()

router.use(deserializeUser, requiredUser)


router.route("")
  .get(
    permissionUser("read", userPermission),
    getUsersHandler
  )


router.route("/profile/:username")
  .get(
    permissionUser("read", userPermission),
    validate(getUserByUsernameSchema),
    getUserByUsernameHandler
  )


router.route("/detail/:userId")
  .get(
    permissionUser("read", userPermission),
    validate(getUserSchema),
    getUserHandler
  )

router.route("/change-role/:userId")
  .patch(
    onlyAdminUser,
    permissionUser("update", userPermission),
    validate(updateUserSchema.changeUserRole),
    changeUserRoleHandler,
  )

router.route("/block-user/:userId")
  .patch(
    onlyAdminUser,
    permissionUser("update", userPermission),
    validate(updateUserSchema.createBlockUser),
    createBlockUserHandler,
  )

router.route("/unblock-user/:userId")
  .patch(
    onlyAdminUser,
    permissionUser("update", userPermission),
    validate(updateUserSchema.removeBlockdUser),
    removeBlockedUserHandler,
  )


export default router
