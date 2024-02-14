import { Router } from "express";
import { deleteAuditLogsHandler, getAuditLogsHandler } from "../controllers/auditLog.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { permissionUser } from "../middleware/permissionUser";
import { deleteAuditLogSchema } from "../schemas/auditLog.schema";
import { auditLogPermission } from "../utils/auth/permissions/auditLog.permission";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()
router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("")
  .get(
    getAuditLogsHandler,
  )


router.route("/detail/:auditLogId")
  .delete(
    validate(deleteAuditLogSchema),
    permissionUser("delete", auditLogPermission),
    deleteAuditLogsHandler,
  )


export default router

