import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { changeRoleUserHandler, createBlockUserHandler, getUserByUsernameHandler, getUserHandler, getUsersHandler, removeBlockedUserHandler } from "../controllers/user.controller";
import { getUserByUsernameSchema, getUserSchema, updateUserSchema } from "../schemas/user.schema";
import { validate } from "../middleware/validate";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { sudo } from "../middleware/sudo";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("")
  .get(
    getUsersHandler
  )


router.route("/profile/:username")
  .get(
    validate(getUserByUsernameSchema),
    getUserByUsernameHandler
  )


router.route("/detail/:userId")
  .get(
    validate(getUserSchema),
    getUserHandler
  )

router.route("/change-role/:userId")
  .patch(
    sudo,
    validate(updateUserSchema.changeUserRole),
    changeRoleUserHandler,
  )

router.route("/block-user")
  .patch(
    validate(updateUserSchema.createBlockUser),
    createBlockUserHandler,
  )

router.route("/unblock-user/:blockedUserId")
  .patch(
    validate(updateUserSchema.removeBlockdUser),
    removeBlockedUserHandler,
  )


export default router
