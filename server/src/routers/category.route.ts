import { Router } from "express"
import { deserializeUser } from "../middleware/deserializeUser"
import { requiredUser } from "../middleware/requiredUser"
import { permissionUser } from "../middleware/permissionUser"
import { categoryPermission } from "../utils/auth/permissions/category.permission"
import { createCategoryHandler, createMultiCategoriesHandler, deleteCategoryHandler, deleteMultiCategoriesHandler, getCategoriesHandler, getCategoryHandler, updateCategoryHandler } from "../controllers/category.controller"
import { validate } from "../middleware/validate"
import { createCategorySchema, createMultiCategoriesSchema, deleteMultiCategoriesSchema, getCategorySchema, updateCategorySchema } from "../schemas/category.schema"

const router = Router()


router.route("")
  .get(
    permissionUser("read", categoryPermission),
    getCategoriesHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", categoryPermission),
    validate(createCategorySchema),
    createCategoryHandler
  )


router.route("/multi")
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", categoryPermission),
    validate(createMultiCategoriesSchema),
    createMultiCategoriesHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("delete", categoryPermission),
    validate(deleteMultiCategoriesSchema),
    deleteMultiCategoriesHandler
  )


router.route("/detail/:categoryId")
  .get(
    permissionUser("read", categoryPermission),
    validate(getCategorySchema),
    getCategoryHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", categoryPermission),
    validate(updateCategorySchema), 
    updateCategoryHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", categoryPermission),
    validate(getCategorySchema),
    deleteCategoryHandler
  )


export default router
