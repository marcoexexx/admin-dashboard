import { Router } from "express";
import { permissionUser } from "../middleware/permissionUser";
import { salesCategoryPermission } from "../utils/auth/permissions/salesCategory.permission";
import { createMultiSalesCategoriesHandler, createSalesCategoryHandler, deleteMultiSalesCategoriesHandler, deleteSalesCategoryHandler, getSalesCategoriesHandler, getSalesCategoryHandler, updateSalesCategoryHandler } from "../controllers/salesCategory.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createMultiSalesCategoriesSchema, createSalesCategorySchema, deleteMultiSalesCategoriesSchema, getSalesCategorySchema, updateSalesCategorySchema } from "../schemas/salesCategory.schema";

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
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", salesCategoryPermission),
    validate(createMultiSalesCategoriesSchema),
    createMultiSalesCategoriesHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", salesCategoryPermission),
    validate(deleteMultiSalesCategoriesSchema),
    deleteMultiSalesCategoriesHandler
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
