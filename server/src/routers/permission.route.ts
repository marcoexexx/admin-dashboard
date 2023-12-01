import { Router } from "express";
import { permissionsBrandsHandler, permissionsCategoriesHandler, permissionsExchangeHandler, permissionsProductsHandler, permissionsSalesCategoriesHandler, permissionsUserHandler } from "../controllers/permission.controller";

const router = Router()


router.get("/users", permissionsUserHandler)
router.get("/exchanges", permissionsExchangeHandler)
router.get("/products", permissionsProductsHandler)
router.get("/brands", permissionsBrandsHandler)
router.get("/category", permissionsCategoriesHandler)
router.get("/sales-category", permissionsSalesCategoriesHandler)


export default router
