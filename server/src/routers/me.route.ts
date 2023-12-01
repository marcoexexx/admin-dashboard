import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { getMeHandler, uploadImageProfileHandler } from "../controllers/user.controller";
import { resizeProfileImage, uploadProfileImage } from "../upload/singleUpload";
import { validate } from "../middleware/validate";
import { uploadImageProfileSchema } from "../schemas/user.schema";

const router = Router()

router.use(deserializeUser, requiredUser)


router.route("/")
  .get(getMeHandler)


// router
//   .route("/change-password")


router.route("/upload")
  .post(
    uploadProfileImage,
    resizeProfileImage,
    validate(uploadImageProfileSchema),
    uploadImageProfileHandler
  )


export default router
