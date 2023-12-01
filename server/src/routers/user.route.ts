import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { changeUserRoleHandler, getUserHandler, getUsersHandler } from "../controllers/user.controller";
import { changeUserRoleSchema, getUserSchema } from "../schemas/user.schema";
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
    validate(changeUserRoleSchema),
    changeUserRoleHandler,
  )


export default router
