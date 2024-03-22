import { Router } from "express";
import {
  createPickupAddressHandler,
  deleteMultiPickupAddressesHandler,
  deletePickupAddressHandler,
  getPickupAddressesHandler,
  getPickupAddressHandler,
} from "../controllers/pickupAddress.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createPickupAddressSchema,
  deleteMultiPickupAddressesSchema,
  getPickupAddressSchema,
} from "../schemas/pickupAddress.schema";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("")
  .get(
    getPickupAddressesHandler,
  )
  .post(
    validate(createPickupAddressSchema),
    createPickupAddressHandler,
  );

router.route("/multi")
  .delete(
    validate(deleteMultiPickupAddressesSchema),
    deleteMultiPickupAddressesHandler,
  );

router.route("/detail/:pickupAddressId")
  .get(
    validate(getPickupAddressSchema),
    getPickupAddressHandler,
  )
  .delete(
    validate(getPickupAddressSchema),
    deletePickupAddressHandler,
  );

export default router;
