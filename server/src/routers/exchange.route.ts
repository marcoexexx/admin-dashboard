import { Router } from "express";
import { permissionUser } from "../middleware/permissionUser";
import { exchangePermission } from "../utils/auth/permissions/exchange.permission";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createExchangeSchema, deleteMultiExchangesSchema, getExchangeSchema, updateExchangeSchema } from "../schemas/exchange.schema";
import { createExchangeHandler, createMultiExchangesHandler, deleteExchangeHandler, deleteMultiExchangesHandler, getExchangeHandler, getExchangesHandler, updateExchangeHandler } from "../controllers/exchange.controller";
import { uploadExcel } from "../upload/excelUpload";


const router = Router()
router.use(deserializeUser, requiredUser)


router.route("")
  .get(
    permissionUser("read", exchangePermission),
    getExchangesHandler,
  )
  .post(
    permissionUser("create", exchangePermission),
    validate(createExchangeSchema),
    createExchangeHandler
  )


router.route("/multi")
  .delete(
    permissionUser("delete", exchangePermission),
    validate(deleteMultiExchangesSchema),
    deleteMultiExchangesHandler
  )


// Upload Routes
router.post("/excel-upload",
  permissionUser("create", exchangePermission),
  uploadExcel,
  createMultiExchangesHandler
)


router.route("/detail/:exchangeId")
  .get(
    permissionUser("read", exchangePermission),
    validate(getExchangeSchema),
    getExchangeHandler
  )
  .patch(
    permissionUser("update", exchangePermission),
    validate(updateExchangeSchema), 
    updateExchangeHandler
  )
  .delete(
    validate(getExchangeSchema),
    permissionUser("delete", exchangePermission),
    deleteExchangeHandler
  )


export default router
