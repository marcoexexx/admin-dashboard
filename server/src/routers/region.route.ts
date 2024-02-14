import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { uploadExcel } from "../upload/excelUpload";
import { regionPermission } from "../utils/auth/permissions";
import { createRegionSchema, deleteMultiRegionsSchema, getRegionSchema, updateRegionSchema } from "../schemas/region.schema";
import { createMultiRegionsHandler, createRegionHandler, deleteMultilRegionsHandler, deleteRegionHandler, getRegionHandler, getRegionsHandler, updateRegionHandler } from "../controllers/region.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()


router.route("")
  .get(
    permissionUser("read", regionPermission),
    getRegionsHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    permissionUser("create", regionPermission),
    validate(createRegionSchema),
    createRegionHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    permissionUser("delete", regionPermission),
    validate(deleteMultiRegionsSchema),
    deleteMultilRegionsHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  checkBlockedUser,
  permissionUser("create", regionPermission),
  uploadExcel,
  createMultiRegionsHandler,
)


router.route("/detail/:regionId")
  .get(
    permissionUser("read", regionPermission),
    validate(getRegionSchema),
    getRegionHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    checkBlockedUser,
    permissionUser("update", regionPermission),
    validate(updateRegionSchema), 
    updateRegionHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getRegionSchema),
    permissionUser("delete", regionPermission),
    deleteRegionHandler
  )


export default router
