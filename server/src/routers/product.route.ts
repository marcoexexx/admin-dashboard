import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { permissionUser } from "../middleware/permissionUser";
import { createMultiProductsHandler, createProductHandler, deleteMultiProductHandler, deleteProductHandler, getProductHandler, getProductsHandler, likeProductByUserHandler, unLikeProductByUserHandler, updateProductHandler, uploadImagesProductHandler } from "../controllers/product.controller";
import { createProductSchema, deleteMultiProductsSchema, getProductSchema, likeProductByUserSchema, updateProductSchema, uploadImagesProductSchema } from "../schemas/product.schema";
import { productPermission } from "../utils/auth/permissions";
import { resizeProductImages, uploadProductImage } from "../upload/multiUpload";
import { uploadExcel } from "../upload/excelUpload";


const router = Router()


router.route("")
  .get(
    permissionUser("read", productPermission),
    getProductsHandler
  )
  .post(
    deserializeUser, 
    requiredUser, 
    permissionUser("create", productPermission), 
    validate(createProductSchema), 
    createProductHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", productPermission),
    validate(deleteMultiProductsSchema),
    deleteMultiProductHandler,
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  permissionUser("create", productPermission),
  uploadExcel,
  createMultiProductsHandler,
)


router.route("/detail/:productId")
  .get(
    validate(getProductSchema), 
    getProductHandler
  )
  .delete(
    deserializeUser, 
    requiredUser, 
    permissionUser("delete", productPermission),
    validate(getProductSchema), 
    deleteProductHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", productPermission),
    validate(updateProductSchema), 
    updateProductHandler
  )


router.route("/like/:productId")
  .patch(
    deserializeUser, 
    requiredUser, 
    // permissionUser("update", productPermission),   /* Should not access update permission!! */
    validate(likeProductByUserSchema), 
    likeProductByUserHandler
  )


router.route("/unlike/:productId")
  .patch(
    deserializeUser, 
    requiredUser, 
    // permissionUser("update", productPermission),   /* Should not access update permission!! */
    validate(likeProductByUserSchema), 
    unLikeProductByUserHandler
  )


router.route("/upload/:productId")
  .post(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", productPermission),
    uploadProductImage,
    resizeProductImages,
    validate(getProductSchema),
    validate(uploadImagesProductSchema),
    uploadImagesProductHandler
  )


export default router
