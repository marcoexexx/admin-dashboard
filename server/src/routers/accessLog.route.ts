import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { deleteAccessLogsHandler, getAccessLogsHandler } from "../controllers/accessLog.controller";
import { getAccessLogSchema } from "../schemas/accessLog.schema";
import { validate } from "../middleware/validate";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("")
  .get(
    getAccessLogsHandler,
  )


router.route("/detail/:accessLogId")
  .delete(
    validate(getAccessLogSchema),
    deleteAccessLogsHandler,
  )


export default router
