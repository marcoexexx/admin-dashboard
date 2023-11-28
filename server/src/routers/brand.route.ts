import { Router } from "express";
import { validate } from "../middleware/validate";
import { createBrandSchema, createMultiBrandsSchema, getBrandSchema } from "../schemas/brand.schema";
import { createBrandHandler, createMultiBrandsHandler, deleteBrandHandler, getBrandHandler, getBrandsHandler } from "../controllers/brand.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { brandPermission } from "../utils/auth/permissions/brand.permission";

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
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", brandPermission),
    validate(createMultiBrandsSchema),
    createMultiBrandsHandler
  )


router.route("/detail/:brandId")
  .get(
    permissionUser("read", brandPermission),
    validate(getBrandSchema),
    getBrandHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    validate(getBrandSchema),
    permissionUser("delete", brandPermission),
    deleteBrandHandler
  )


export default router
