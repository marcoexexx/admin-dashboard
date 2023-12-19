import { Router } from "express";
import { permissionUser } from "../middleware/permissionUser";
import { salesCategoryPermission } from "../utils/auth/permissions/salesCategory.permission";
import { createMultiSalesCategoriesHandler, createSalesCategoryHandler, deleteMultiSalesCategoriesHandler, deleteSalesCategoryHandler, getSalesCategoriesHandler, getSalesCategoryHandler, updateSalesCategoryHandler } from "../controllers/salesCategory.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createSalesCategorySchema, deleteMultiSalesCategoriesSchema, getSalesCategorySchema, updateSalesCategorySchema } from "../schemas/salesCategory.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router()


router.route("")
  .get(
    permissionUser("read", salesCategoryPermission),
    getSalesCategoriesHandler,
  )
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", salesCategoryPermission),
    validate(createSalesCategorySchema),
    createSalesCategoryHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", salesCategoryPermission),
    validate(deleteMultiSalesCategoriesSchema),
    deleteMultiSalesCategoriesHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  permissionUser("create", salesCategoryPermission),
  uploadExcel,
  createMultiSalesCategoriesHandler
)


router.route("/detail/:salesCategoryId")
  .get(
    permissionUser("read", salesCategoryPermission),
    validate(getSalesCategorySchema),
    getSalesCategoryHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", salesCategoryPermission),
    validate(updateSalesCategorySchema), 
    updateSalesCategoryHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", salesCategoryPermission),
    validate(getSalesCategorySchema),
    deleteSalesCategoryHandler
  )


export default router
