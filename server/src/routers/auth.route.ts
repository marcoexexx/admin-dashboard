import { Router } from "express";
import { validate } from "../middleware/validate";
import { createUserSchema, loginUserSchema, resendEmailVerificationSchema, veriffyEmailSchema } from "../schemas/user.schema";
import { googleOAuthHandler, loginUserHandler, logoutHandler, refreshTokenHandler, registerUserHandler, resendEmailVerificationCodeHandler, verificationEmailHandler } from "../controllers/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import getConfig from "../utils/getConfig";

const router = Router()


if (getConfig("nodeEnv") === "development") router.get("/delete/:userId", async (req, res) => {
  const { db } = await import("../utils/db")
  const {userId} = req.params
  await db.accessLog.deleteMany({
    where: {
      userId
    }
  })
  await db.user.delete({
    where: {
      id: userId
    }
  })

  res.status(200).json( "Success" )
})


router.route("/register")
  .post(
    validate(createUserSchema),
    registerUserHandler
  )


router.route("/verifyEmail/resend")
  .post(
    validate(resendEmailVerificationSchema),
    resendEmailVerificationCodeHandler
  )

router.route("/verifyEmail/:verificationCode")
  .get(
    validate(veriffyEmailSchema),
    verificationEmailHandler
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
