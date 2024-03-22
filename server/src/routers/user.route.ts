import { Router } from "express";
import {
  createBlockUserHandler,
  getUserByUsernameHandler,
  getUserHandler,
  getUsersHandler,
  removeBlockedUserHandler,
  updateRoleUserBySuperuserHandler,
} from "../controllers/user.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { sudo } from "../middleware/sudo";
import { validate } from "../middleware/validate";
import {
  getUserByUsernameSchema,
  getUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("")
  .get(
    getUsersHandler,
  );

router.route("/profile/:username")
  .get(
    validate(getUserByUsernameSchema),
    getUserByUsernameHandler,
  );

router.route("/detail/:userId")
  .get(
    validate(getUserSchema),
    getUserHandler,
  )
  .patch(
    // sudo,  // Only shop owner change role
    validate(updateUserSchema.update),
    updateRoleUserBySuperuserHandler,
  );

router.route("/block-user")
  .patch(
    sudo,
    validate(updateUserSchema.createBlockUser),
    createBlockUserHandler,
  );

router.route("/unblock-user/:blockedUserId")
  .patch(
    sudo,
    validate(updateUserSchema.removeBlockdUser),
    removeBlockedUserHandler,
  );

export default router;
