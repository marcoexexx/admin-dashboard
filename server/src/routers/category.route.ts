import { Router } from "express"
import { deserializeUser } from "../middleware/deserializeUser"
import { requiredUser } from "../middleware/requiredUser"
import { createCategoryHandler, createMultiCategoriesHandler, deleteCategoryHandler, deleteMultiCategoriesHandler, getCategoriesHandler, getCategoryHandler, updateCategoryHandler } from "../controllers/category.controller"
import { validate } from "../middleware/validate"
import { createCategorySchema, deleteMultiCategoriesSchema, getCategorySchema, updateCategorySchema } from "../schemas/category.schema"
import { uploadExcel } from "../upload/excelUpload"
import { checkBlockedUser } from "../middleware/checkBlockedUser"

const router = Router()


router.route("")
  .get(
    getCategoriesHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(createCategorySchema),
    createCategoryHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(deleteMultiCategoriesSchema),
    deleteMultiCategoriesHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  checkBlockedUser,
  uploadExcel,
  createMultiCategoriesHandler
)


router.route("/detail/:categoryId")
  .get(
    validate(getCategorySchema),
    getCategoryHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    checkBlockedUser,
    validate(updateCategorySchema), 
    updateCategoryHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getCategorySchema),
    deleteCategoryHandler
  )


export default router
