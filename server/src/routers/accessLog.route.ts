import { Router } from "express";
import { deleteAccessLogsHandler, getAccessLogsHandler } from "../controllers/accessLog.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { getAccessLogSchema } from "../schemas/accessLog.schema";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("")
  .get(
    getAccessLogsHandler,
  );

router.route("/detail/:accessLogId")
  .delete(
    validate(getAccessLogSchema),
    deleteAccessLogsHandler,
  );

export default router;
