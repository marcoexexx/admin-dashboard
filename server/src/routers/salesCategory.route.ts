import { Router } from "express";
import {
  createMultiSalesCategoriesHandler,
  createSalesCategoryHandler,
  deleteMultiSalesCategoriesHandler,
  deleteSalesCategoryHandler,
  getSalesCategoriesHandler,
  getSalesCategoryHandler,
  updateSalesCategoryHandler,
} from "../controllers/salesCategory.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createSalesCategorySchema,
  deleteMultiSalesCategoriesSchema,
  getSalesCategorySchema,
  updateSalesCategorySchema,
} from "../schemas/salesCategory.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router();

router.route("")
  .get(
    getSalesCategoriesHandler,
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(createSalesCategorySchema),
    createSalesCategoryHandler,
  );

router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(deleteMultiSalesCategoriesSchema),
    deleteMultiSalesCategoriesHandler,
  );

// Upload Routes
router.post(
  "/excel-upload",
  deserializeUser,
  requiredUser,
  checkBlockedUser,
  uploadExcel,
  createMultiSalesCategoriesHandler,
);

router.route("/detail/:salesCategoryId")
  .get(
    validate(getSalesCategorySchema),
    getSalesCategoryHandler,
  )
  .patch(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(updateSalesCategorySchema),
    updateSalesCategoryHandler,
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getSalesCategorySchema),
    deleteSalesCategoryHandler,
  );

export default router;
