import { Router } from "express";
import { permissionUser } from "../middleware/permissionUser";
import { salesCategoryPermission } from "../utils/auth/permissions/salesCategory.permission";
import { createSalesCategoryHandler, deleteSalesCategoryHandler, getSalesCategoriesHandler, getSalesCategoryHandler } from "../controllers/salesCategory.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createSalesCategorySchema, getSalesCategorySchema } from "../schemas/salesCategory.schema";

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


router.route("/detail/:salesCategoryId")
  .get(
    permissionUser("read", salesCategoryPermission),
    validate(getSalesCategorySchema),
    getSalesCategoryHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", salesCategoryPermission),
    validate(getSalesCategorySchema),
    deleteSalesCategoryHandler
  )


export default router
