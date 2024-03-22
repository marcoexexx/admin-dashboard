import { Router } from "express";
import {
  createBrandHandler,
  createMultiBrandsHandler,
  deleteBrandHandler,
  deleteMultiBrandsHandler,
  getBrandHandler,
  getBrandsHandler,
  updateBrandHandler,
} from "../controllers/brand.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createBrandSchema,
  deleteMultiBrandsSchema,
  getBrandSchema,
  updateBrandSchema,
} from "../schemas/brand.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router();

router.route("")
  .get(
    getBrandsHandler,
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(createBrandSchema),
    createBrandHandler,
  );

router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(deleteMultiBrandsSchema),
    deleteMultiBrandsHandler,
  );

// Upload Routes
router.post(
  "/excel-upload",
  deserializeUser,
  requiredUser,
  checkBlockedUser,
  uploadExcel,
  createMultiBrandsHandler,
);

router.route("/detail/:brandId")
  .get(
    validate(getBrandSchema),
    getBrandHandler,
  )
  .patch(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(updateBrandSchema),
    updateBrandHandler,
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getBrandSchema),
    deleteBrandHandler,
  );

export default router;
