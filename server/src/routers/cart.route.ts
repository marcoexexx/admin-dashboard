import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deleteCartOrderItemSchema, getCartSchema, initialCartSchema } from "../schemas/cart.schema";
import { deleteCartHandler, deleteCartOrderItemHandler, getCartHandler, initialCartHandler } from "../controllers/cart.controller";


const router = Router()


router.route("")
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(initialCartSchema),
    initialCartHandler
  )


router.route("/detail/:cartId")
  .get(
    validate(getCartSchema),
    getCartHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getCartSchema),
    deleteCartHandler
  )


router.route("/orderItems/detail/:orderItemId").delete(validate(deleteCartOrderItemSchema), deleteCartOrderItemHandler)


export default router

