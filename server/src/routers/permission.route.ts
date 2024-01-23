import { Router } from "express";
import { permissionsAccessLogsHandler, permissionsAuditLogsHandler, permissionsBrandsHandler, permissionsCategoriesHandler, permissionsCouponsHandler, permissionsExchangeHandler, permissionsOrdersHandler, permissionsPickupAddressHandler, permissionsPotetialOrdersHandler, permissionsProductsHandler, permissionsRegionsHandler, permissionsSalesCategoriesHandler, permissionsTownshipsHandler, permissionsUserAddressHandler, permissionsUserHandler } from "../controllers/permission.controller";

const router = Router()


router.get("/users", permissionsUserHandler)
router.get("/exchanges", permissionsExchangeHandler)
router.get("/products", permissionsProductsHandler)
router.get("/brands", permissionsBrandsHandler)
router.get("/category", permissionsCategoriesHandler)
router.get("/sales-category", permissionsSalesCategoriesHandler)
router.get("/orders", permissionsOrdersHandler)
router.get("/potential-orders", permissionsPotetialOrdersHandler)
router.get("/access-logs", permissionsAccessLogsHandler)
router.get("/audit-logs", permissionsAuditLogsHandler)
router.get("/coupons", permissionsCouponsHandler)
router.get("/regions", permissionsRegionsHandler)
router.get("/townships", permissionsTownshipsHandler)
router.get("/user-address", permissionsUserAddressHandler)
router.get("/pickup-address", permissionsPickupAddressHandler)


export default router
