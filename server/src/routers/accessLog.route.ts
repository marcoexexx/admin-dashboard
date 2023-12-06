import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { accessLogPermission } from "../utils/auth/permissions/accessLog.permission";
import { deleteAccessLogsHandler, getAccessLogsHandler } from "../controllers/accessLog.controller";

const router = Router()

router.use(deserializeUser, requiredUser)


router.route("")
  .get(
    permissionUser("read", accessLogPermission),
    getAccessLogsHandler,
  )


router.route("")
  .get(
    permissionUser("delete", accessLogPermission),
    deleteAccessLogsHandler,
  )


export default router
