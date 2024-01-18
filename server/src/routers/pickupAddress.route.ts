import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { pickupAddressPermission } from "../utils/auth/permissions";
import { deleteMultiPickupAddressesSchema, getPickupAddressSchema } from "../schemas/pickupAddress.schema";
import { deleteMultiPickupAddressesHandler, deletePickupAddressHandler, getPickupAddressHandler, getPickupAddressesHandler } from "../controllers/pickupAddress.controller";


const router = Router()

router.use(deserializeUser, requiredUser)


router.route("")
  .get(
    permissionUser("read", pickupAddressPermission),
    getPickupAddressesHandler
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
