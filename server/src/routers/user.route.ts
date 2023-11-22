import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { changeUserRoleHandler, getUsersHandler } from "../controllers/user.controller";
import { changeUserRoleSchema } from "../schemas/user.schema";
import { validate } from "../middleware/validate";
import { onlyAdminUser } from "../middleware/onlyAdminUser";
import { permissionUser } from "../middleware/permissionUser";
import { userPermission } from "../utils/auth/permissions";

const router = Router()

router.use(deserializeUser, requiredUser)


router.route("/").get(getUsersHandler)

router.route("/change-role/:userId")
  .patch(
    onlyAdminUser,
    permissionUser("update", userPermission),
    validate(changeUserRoleSchema),
    changeUserRoleHandler,
  )


export default router
