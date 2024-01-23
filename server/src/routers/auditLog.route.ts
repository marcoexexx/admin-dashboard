import { Router } from "express";
import { deleteAuditLogsHandler, getAuditLogsHandler } from "../controllers/auditLog.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { permissionUser } from "../middleware/permissionUser";
import { deleteAuditLogSchema } from "../schemas/auditLog.schema";
import { auditLogPermission } from "../utils/auth/permissions/auditLog.permission";

const router = Router()

router.route("")
  .get(
    getAuditLogsHandler,
  )


router.route("/detail/:auditLogId")
  .delete(
    deserializeUser,
    requiredUser,
    validate(deleteAuditLogSchema),
    permissionUser("delete", auditLogPermission),
    deleteAuditLogsHandler,
  )


export default router

