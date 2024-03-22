import { Router } from "express";
import {
  getMeHandler,
  uploadImageCoverHandler,
  uploadImageProfileHandler,
} from "../controllers/user.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { uploadImageProfileSchema } from "../schemas/user.schema";
import { resizeProfileImage, uploadProfileImage } from "../upload/singleUpload";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("/")
  .get(getMeHandler);

// router
//   .route("/change-password")

router.route("/upload/profile-picture")
  .post(
    uploadProfileImage,
    resizeProfileImage,
    validate(uploadImageProfileSchema),
    uploadImageProfileHandler,
  );

router.route("/upload/cover-photo")
  .post(
    uploadProfileImage,
    resizeProfileImage,
    validate(uploadImageProfileSchema),
    uploadImageCoverHandler,
  );

export default router;
