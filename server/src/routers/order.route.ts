import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { validate } from "../middleware/validate";
import { orderPermission } from "../utils/auth/permissions";
import { createOrderHandler, deleteMultiOrdersHandler, deleteOrderHandler, getOrderHandler, getOrdersHandler, updateOrderHandler } from "../controllers/order.controller";
import { createOrderSchema, deleteMultiOrdersSchema, getOrderSchema, updateOrderSchema } from "../schemas/order.schema";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("/")
  .get(
    permissionUser("read", orderPermission),
    getOrdersHandler
  )
  .post(
    permissionUser("create", orderPermission),
    validate(createOrderSchema),
    createOrderHandler
  )


router.route("/multi")
  .delete(
    permissionUser("delete", orderPermission),
    validate(deleteMultiOrdersSchema),
    deleteMultiOrdersHandler
  )


// // Upload Routes
// router.post("/excel-upload",
//   permissionUser("create", orderPermission),
//   uploadExcel,
//   createMultiCouponsHandler
// )


router.route("/detail/:orderId")
  .get(
    permissionUser("read", orderPermission),
    validate(getOrderSchema),
    getOrderHandler
  )
  .patch(
    permissionUser("update", orderPermission),
    validate(updateOrderSchema), 
    updateOrderHandler
  )
  .delete(
    permissionUser("delete", orderPermission),
    validate(getOrderSchema),
    deleteOrderHandler
  )


export default router 
