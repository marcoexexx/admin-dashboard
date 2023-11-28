import { Router } from "express";
import { permissionUser } from "../middleware/permissionUser";
import { exchangePermission } from "../utils/auth/permissions/exchange.permission";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createExchangeSchema, getExchangeSchema } from "../schemas/exchange.schema";
import { createExchangeHandler, deleteExchangeHandler, getExchangesHandler } from "../controllers/exchange.controller";

const router = Router()


router.route("")
  .get(
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


router.route("/detail/:exchangeId")
  .get(
    permissionUser("read", exchangePermission),
    validate(getExchangeSchema),
    getExchangesHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    validate(getExchangeSchema),
    permissionUser("delete", exchangePermission),
    deleteExchangeHandler
  )


export default router
