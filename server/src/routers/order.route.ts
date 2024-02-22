import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createOrderHandler, deleteMultiOrdersHandler, deleteOrderHandler, getOrderHandler, getOrdersHandler, updateOrderHandler } from "../controllers/order.controller";
import { createOrderSchema, deleteMultiOrdersSchema, getOrderSchema, updateOrderSchema } from "../schemas/order.schema";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("/")
  .get(
    getOrdersHandler
  )
  .post(
    validate(createOrderSchema),
    createOrderHandler
  )


router.route("/multi")
  .delete(
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
    validate(getOrderSchema),
    getOrderHandler
  )
  .patch(
    validate(updateOrderSchema), 
    updateOrderHandler
  )
  .delete(
    validate(getOrderSchema),
    deleteOrderHandler
  )


export default router 
