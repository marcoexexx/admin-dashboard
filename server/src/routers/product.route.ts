import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { permissionUser } from "../middleware/permissionUser";
import { createProductHandler, deleteProductHandler, getProductHandler, getProductsHandler, likeProductByUserHandler, unLikeProductByUserHandler, updateProductHandler, uploadImagesProductHandler } from "../controllers/product.controller";
import { createProductSchema, getProductSchema, likeProductByUserSchema, updateProductSchema, uploadImagesProductSchema } from "../schemas/product.schema";
import { productPermission } from "../utils/auth/permissions";
import { resizeProductImages, uploadProductImage } from "../upload/multiUpload";
import { createMultiExchangesSchema } from "../schemas/exchange.schema";
import { createMultiExchangesHandler } from "../controllers/exchange.controller";


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
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", productPermission),
    validate(createMultiExchangesSchema),
    createMultiExchangesHandler
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
