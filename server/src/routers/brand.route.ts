import { Router } from "express";
import { validate } from "../middleware/validate";
import { createBrandSchema, deleteMultiBrandsSchema, getBrandSchema, updateBrandSchema } from "../schemas/brand.schema";
import { createBrandHandler, createMultiBrandsHandler, deleteBrandHandler, deleteMultiBrandsHandler, getBrandHandler, getBrandsHandler, updateBrandHandler } from "../controllers/brand.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { brandPermission } from "../utils/auth/permissions/brand.permission";
import { uploadExcel } from "../upload/excelUpload";


const router = Router()


router.route("")
  .get(
    permissionUser("read", brandPermission),
    getBrandsHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", brandPermission),
    validate(createBrandSchema),
    createBrandHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", brandPermission),
    validate(deleteMultiBrandsSchema),
    deleteMultiBrandsHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  permissionUser("create", brandPermission),
  uploadExcel,
  createMultiBrandsHandler,
)


router.route("/detail/:brandId")
  .get(
    deserializeUser,
    permissionUser("read", brandPermission),
    validate(getBrandSchema),
    getBrandHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", brandPermission),
    validate(updateBrandSchema), 
    updateBrandHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    validate(getBrandSchema),
    permissionUser("delete", brandPermission),
    deleteBrandHandler
  )


export default router
