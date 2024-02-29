import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { createCartOrderItemSchema, deleteCartOrderItemSchema, getCartSchema, updateCartOrderItemSchema } from "../schemas/cart.schema";
import { createCartOrderItemHandler, deleteCartHandler, deleteCartOrderItemHandler, getCartHandler, updateCartOrderItemHandler } from "../controllers/cart.controller";


const router = Router()


router.route("")
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(createCartOrderItemSchema),
    createCartOrderItemHandler
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


router.route("/orderItems/detail/:orderItemId")
  .patch(
    validate(updateCartOrderItemSchema),
    updateCartOrderItemHandler
  )
  .delete(
    validate(deleteCartOrderItemSchema), 
    deleteCartOrderItemHandler
  )


export default router
