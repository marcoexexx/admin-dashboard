import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { getMeHandler } from "../controllers/user.controller";

const router = Router()

router.use(deserializeUser, requiredUser)


router.route("/")
  .get(getMeHandler)


export default router
