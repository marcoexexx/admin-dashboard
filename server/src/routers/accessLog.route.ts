import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { accessLogPermission } from "../utils/auth/permissions/accessLog.permission";
import { deleteAccessLogsHandler, getAccessLogsHandler } from "../controllers/accessLog.controller";
import { getAccessLogSchema } from "../schemas/accessLog.schema";
import { validate } from "../middleware/validate";

const router = Router()

router.use(deserializeUser, requiredUser)


router.route("")
  .get(
    permissionUser("read", accessLogPermission),
    getAccessLogsHandler,
  )


router.route("/detail/:accessLogId")
  .delete(
    validate(getAccessLogSchema),
    permissionUser("delete", accessLogPermission),
    deleteAccessLogsHandler,
  )


export default router
