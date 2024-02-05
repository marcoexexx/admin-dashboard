import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { permissionUser } from "../middleware/permissionUser";
import { createMultiProductsHandler, createProductHandler, deleteMultiProductHandler, deleteProductHandler, deleteProductSaleCategoryHandler, getProductHandler, getProductsHandler, likeProductByUserHandler, unLikeProductByUserHandler, updateProductHandler, updateProductSalesCategoryHandler, uploadImagesProductHandler } from "../controllers/product.controller";
import { createProductSchema, deleteMultiProductsSchema, getProductSaleCategorySchema, getProductSchema, likeProductByUserSchema, updateProductSchema, uploadImagesProductSchema } from "../schemas/product.schema";
import { productPermission, salesCategoryPermission } from "../utils/auth/permissions";
import { resizeProductImages, uploadProductImage } from "../upload/multiUpload";
import { uploadExcel } from "../upload/excelUpload";
import { createSaleCategoryForProductHandler, getSalesCategoriesInProductHandler } from "../controllers/salesCategory.controller";
import { createProductSalesCategorySchema, updateProductSaleCategorySchema } from "../schemas/salesCategory.schema";


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


router.route("/detail/:productId/sales")
  .get(
    permissionUser("read", salesCategoryPermission),
    getSalesCategoriesInProductHandler
  )
  .post(
    deserializeUser, 
    requiredUser, 
    permissionUser("create", salesCategoryPermission),
    validate(createProductSalesCategorySchema),
    createSaleCategoryForProductHandler
  )


router.route("/detail/:productId/sales/detail/:productSaleCategoryId")
  // .get(
  //   validate(getProductSchema), 
  //   getProductHandler
  // )
  .delete(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", productPermission),
    validate(getProductSaleCategorySchema), 
    deleteProductSaleCategoryHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", productPermission),
    validate(updateProductSaleCategorySchema), 
    updateProductSalesCategoryHandler
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
