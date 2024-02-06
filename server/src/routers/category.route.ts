import { Router } from "express"
import { deserializeUser } from "../middleware/deserializeUser"
import { requiredUser } from "../middleware/requiredUser"
import { permissionUser } from "../middleware/permissionUser"
import { categoryPermission } from "../utils/auth/permissions/category.permission"
import { createCategoryHandler, createMultiCategoriesHandler, deleteCategoryHandler, deleteMultiCategoriesHandler, getCategoriesHandler, getCategoryHandler, updateCategoryHandler } from "../controllers/category.controller"
import { validate } from "../middleware/validate"
import { createCategorySchema, deleteMultiCategoriesSchema, getCategorySchema, updateCategorySchema } from "../schemas/category.schema"
import { uploadExcel } from "../upload/excelUpload"

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
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", categoryPermission),
    validate(deleteMultiCategoriesSchema),
    deleteMultiCategoriesHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  permissionUser("create", categoryPermission),
  uploadExcel,
  createMultiCategoriesHandler
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
