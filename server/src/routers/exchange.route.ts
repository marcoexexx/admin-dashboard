import { Router } from "express";
import { permissionUser } from "../middleware/permissionUser";
import { exchangePermission } from "../utils/auth/permissions/exchange.permission";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createExchangeSchema, createMultiExchangesSchema, deleteMultiExchangesSchema, getExchangeSchema, updateExchangeSchema } from "../schemas/exchange.schema";
import { createExchangeHandler, createMultiExchangesHandler, deleteExchangeHandler, deleteMultiExchangesHandler, getExchangeHandler, getExchangesHandler, updateExchangeHandler } from "../controllers/exchange.controller";

const router = Router()


router.route("")
  .get(
    deserializeUser,
    requiredUser,
    permissionUser("read", exchangePermission),
    getExchangesHandler,
  )
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", exchangePermission),
    validate(createExchangeSchema),
    createExchangeHandler
  )


router.route("/multi")
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", exchangePermission),
    validate(createMultiExchangesSchema),
    createMultiExchangesHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", exchangePermission),
    validate(deleteMultiExchangesSchema),
    deleteMultiExchangesHandler
  )


router.route("/detail/:exchangeId")
  .get(
    deserializeUser,
    requiredUser,
    permissionUser("read", exchangePermission),
    validate(getExchangeSchema),
    getExchangeHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", exchangePermission),
    validate(updateExchangeSchema), 
    updateExchangeHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    validate(getExchangeSchema),
    permissionUser("delete", exchangePermission),
    deleteExchangeHandler
  )


export default router
