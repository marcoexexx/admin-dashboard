import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { pickupAddressPermission } from "../utils/auth/permissions";
import { createPickupAddressSchema, deleteMultiPickupAddressesSchema, getPickupAddressSchema } from "../schemas/pickupAddress.schema";
import { createPickupAddressHandler, deleteMultiPickupAddressesHandler, deletePickupAddressHandler, getPickupAddressHandler, getPickupAddressesHandler } from "../controllers/pickupAddress.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("")
  .get(
    permissionUser("read", pickupAddressPermission),
    getPickupAddressesHandler
  )
  .post(
    permissionUser("create", pickupAddressPermission),
    validate(createPickupAddressSchema),
    createPickupAddressHandler
  )


router.route("/multi")
  .delete(
    permissionUser("delete", pickupAddressPermission),
    validate(deleteMultiPickupAddressesSchema),
    deleteMultiPickupAddressesHandler
  )


router.route("/detail/:pickupAddressId")
  .get(
    permissionUser("read", pickupAddressPermission),
    validate(getPickupAddressSchema),
    getPickupAddressHandler
  )
  .delete(
    permissionUser("delete", pickupAddressPermission),
    validate(getPickupAddressSchema),
    deletePickupAddressHandler
  )


export default router
