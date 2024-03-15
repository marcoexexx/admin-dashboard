import { Router } from "express";
import {
  createMultiTownshipsHandler,
  createTownshipHandler,
  deleteMultilTownshipsHandler,
  deleteTownshipHandler,
  getTownshipHandler,
  getTownshipsHandler,
  updateTownshipHandler,
} from "../controllers/township.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createTownshipSchema,
  deleteMultiTownshipsSchema,
  getTownshipSchema,
  updateTownshipSchema,
} from "../schemas/township.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router();

router.route("")
  .get(
    getTownshipsHandler,
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(createTownshipSchema),
    createTownshipHandler,
  );

router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(deleteMultiTownshipsSchema),
    deleteMultilTownshipsHandler,
  );

// Upload Routes
router.post("/excel-upload", deserializeUser, requiredUser, checkBlockedUser, uploadExcel, createMultiTownshipsHandler);

router.route("/detail/:townshipId")
  .get(
    validate(getTownshipSchema),
    getTownshipHandler,
  )
  .patch(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(updateTownshipSchema),
    updateTownshipHandler,
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getTownshipSchema),
    deleteTownshipHandler,
  );

export default router;
