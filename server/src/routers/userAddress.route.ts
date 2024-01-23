import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { userAddressPermission } from "../utils/auth/permissions";
import { createUserAddressSchema, deleteMultiUserAddressesSchema, getUserAddressSchema, updateUserAddressSchema } from "../schemas/userAddress.schema";
import { createUserAddressHandler, deleteMultiUserAddressesHandler, deleteUserAddressHandler, getUserAddressHandler, getUserAddressesHandler, updateUserAddressHandler } from "../controllers/userAddress.controller";


const router = Router()

router.use(deserializeUser, requiredUser)


router.route("")
  .get(
    permissionUser("read", userAddressPermission),
    getUserAddressesHandler
  )
  .post(
    permissionUser("create", userAddressPermission),
    validate(createUserAddressSchema),
    createUserAddressHandler
  )


router.route("/multi")
  .delete(
    permissionUser("delete", userAddressPermission),
    validate(deleteMultiUserAddressesSchema),
    deleteMultiUserAddressesHandler
  )


router.route("/detail/:userAddressId")
  .get(
    deserializeUser,
    permissionUser("read", userAddressPermission),
    validate(getUserAddressSchema),
    getUserAddressHandler
  )
  .patch(
    permissionUser("update", userAddressPermission),
    validate(updateUserAddressSchema), 
    updateUserAddressHandler
  )
  .delete(
    permissionUser("delete", userAddressPermission),
    validate(getUserAddressSchema),
    deleteUserAddressHandler
  )


export default router
