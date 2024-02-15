import { Router } from "express";
import { deleteAuditLogsHandler, getAuditLogsHandler } from "../controllers/auditLog.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { deleteAuditLogSchema } from "../schemas/auditLog.schema";
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
    deleteAuditLogsHandler,
  )


export default router

