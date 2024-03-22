import { Router } from "express";
import {
  createUserAddressHandler,
  deleteMultiUserAddressesHandler,
  deleteUserAddressHandler,
  getUserAddressesHandler,
  getUserAddressHandler,
  updateUserAddressHandler,
} from "../controllers/userAddress.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createUserAddressSchema,
  deleteMultiUserAddressesSchema,
  getUserAddressSchema,
  updateUserAddressSchema,
} from "../schemas/userAddress.schema";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("")
  .get(
    getUserAddressesHandler,
  )
  .post(
    validate(createUserAddressSchema),
    createUserAddressHandler,
  );

router.route("/multi")
  .delete(
    validate(deleteMultiUserAddressesSchema),
    deleteMultiUserAddressesHandler,
  );

router.route("/detail/:userAddressId")
  .get(
    deserializeUser,
    validate(getUserAddressSchema),
    getUserAddressHandler,
  )
  .patch(
    validate(updateUserAddressSchema),
    updateUserAddressHandler,
  )
  .delete(
    validate(getUserAddressSchema),
    deleteUserAddressHandler,
  );

export default router;
