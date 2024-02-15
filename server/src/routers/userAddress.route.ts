import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { createUserAddressSchema, deleteMultiUserAddressesSchema, getUserAddressSchema, updateUserAddressSchema } from "../schemas/userAddress.schema";
import { createUserAddressHandler, deleteMultiUserAddressesHandler, deleteUserAddressHandler, getUserAddressHandler, getUserAddressesHandler, updateUserAddressHandler } from "../controllers/userAddress.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("")
  .get(
    getUserAddressesHandler
  )
  .post(
    validate(createUserAddressSchema),
    createUserAddressHandler
  )


router.route("/multi")
  .delete(
    validate(deleteMultiUserAddressesSchema),
    deleteMultiUserAddressesHandler
  )


router.route("/detail/:userAddressId")
  .get(
    deserializeUser,
    validate(getUserAddressSchema),
    getUserAddressHandler
  )
  .patch(
    validate(updateUserAddressSchema), 
    updateUserAddressHandler
  )
  .delete(
    validate(getUserAddressSchema),
    deleteUserAddressHandler
  )


export default router
