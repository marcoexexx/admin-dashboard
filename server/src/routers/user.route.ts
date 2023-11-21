import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { getUsersHandler } from "../controllers/user.controller";

const router = Router()

// router.use(deserializeUser, requiredUser)


router.route("/").get(getUsersHandler)


export default router
