import { Router } from "express";
import { deleteAuditLogsHandler, getAuditLogsHandler } from "../controllers/auditLog.controller";

const router = Router()

router.route("")
  .get(
    getAuditLogsHandler,
  )


router.route("")
  .get(
    deleteAuditLogsHandler,
  )


export default router

