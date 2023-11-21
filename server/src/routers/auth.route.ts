import { Router } from "express";
import { validate } from "../middleware/validate";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { googleOAuthHandler, loginUserHandler, logoutHandler, refreshTokenHandler, registerUserHandler } from "../controllers/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";

const router = Router()


router.route("/register")
  .post(
    validate(createUserSchema),
    registerUserHandler
  )

router.route("/login")
  .post(
    validate(loginUserSchema),
    loginUserHandler
  )

router.route("/refresh").get(refreshTokenHandler)

router.route("/logout")
  .post(
    deserializeUser,
    requiredUser,
    logoutHandler
  )

router.route("/oauth/google").get(googleOAuthHandler)


export default router
