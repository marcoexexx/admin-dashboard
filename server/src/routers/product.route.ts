import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { permissionUser } from "../middleware/permissionUser";
import { createProductHandler, deleteProductHandler, getProductHandler, getProductsHandler, uploadImagesProductHandler } from "../controllers/product.controller";
import { createProductSchema, getProductSchema, uploadImagesProductSchema } from "../schemas/product.schema";
import { productPermission } from "../utils/auth/permissions";

const router = Router()



// /products?filter[name][contains]=test&filter[name][mode]=insensitive
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


router.route("/upload/:productId")
  .post(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", productPermission),
    // uploadProductImage,
    // resizeProductImages,
    validate(getProductSchema),
    validate(uploadImagesProductSchema),
    uploadImagesProductHandler
  )


export default router
