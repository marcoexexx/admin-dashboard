import { Router } from "express";
import { permissionsAccessLogsHandler, permissionsBrandsHandler, permissionsCategoriesHandler, permissionsCouponsHandler, permissionsExchangeHandler, permissionsOrdersHandler, permissionsProductsHandler, permissionsRegionsHandler, permissionsSalesCategoriesHandler, permissionsUserHandler } from "../controllers/permission.controller";

const router = Router()


router.get("/users", permissionsUserHandler)
router.get("/exchanges", permissionsExchangeHandler)
router.get("/products", permissionsProductsHandler)
router.get("/brands", permissionsBrandsHandler)
router.get("/category", permissionsCategoriesHandler)
router.get("/sales-category", permissionsSalesCategoriesHandler)
router.get("/orders", permissionsOrdersHandler)
router.get("/access-logs", permissionsAccessLogsHandler)
router.get("/coupons", permissionsCouponsHandler)
router.get("/regions", permissionsRegionsHandler)


export default router
