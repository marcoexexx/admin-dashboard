import { Router } from "express"
import { deserializeUser } from "../middleware/deserializeUser"
import { requiredUser } from "../middleware/requiredUser"
import { permissionUser } from "../middleware/permissionUser"
import { categoryPermission } from "../utils/auth/permissions/category.permission"
import { createCategoryHandler, deleteCategoryHandler, getCategoriesHandler, getCategoryHandler } from "../controllers/category.controller"
import { validate } from "../middleware/validate"
import { createCategorySchema, getCategorySchema } from "../schemas/category.schema"

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


router.route("/detail/:categoryId")
  .get(
    permissionUser("read", categoryPermission),
    validate(getCategorySchema),
    getCategoryHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", categoryPermission),
    validate(getCategorySchema),
    deleteCategoryHandler
  )


export default router
