import { Router } from "express";
import { deleteAuditLogsHandler, getAuditLogsHandler } from "../controllers/auditLog.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { getAccessLogSchema } from "../schemas/accessLog.schema";
import { permissionUser } from "../middleware/permissionUser";
import { accessLogPermission } from "../utils/auth/permissions/accessLog.permission";

const router = Router()

router.route("")
  .get(
    getAuditLogsHandler,
  )


router.route("/detail/:auditLogId")
  .delete(
    deserializeUser,
    requiredUser,
    validate(getAccessLogSchema),
    permissionUser("delete", accessLogPermission),
    deleteAuditLogsHandler,
  )


export default router

