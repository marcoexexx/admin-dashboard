import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { uploadExcel } from "../upload/excelUpload";
import { createMultiTownshipsHandler, createTownshipHandler, deleteMultilTownshipsHandler, deleteTownshipHandler, getTownshipHandler, getTownshipsHandler, updateTownshipHandler } from "../controllers/township.controller";
import { createTownshipSchema, deleteMultiTownshipsSchema, getTownshipSchema, updateTownshipSchema } from "../schemas/township.schema";
import { townshipPermission } from "../utils/auth/permissions";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()


router.route("")
  .get(
    permissionUser("read", townshipPermission),
    getTownshipsHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    permissionUser("create", townshipPermission),
    validate(createTownshipSchema),
    createTownshipHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    permissionUser("delete", townshipPermission),
    validate(deleteMultiTownshipsSchema),
    deleteMultilTownshipsHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  checkBlockedUser,
  permissionUser("create", townshipPermission),
  uploadExcel,
  createMultiTownshipsHandler,
)


router.route("/detail/:townshipId")
  .get(
    permissionUser("read", townshipPermission),
    validate(getTownshipSchema),
    getTownshipHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    checkBlockedUser,
    permissionUser("update", townshipPermission),
    validate(updateTownshipSchema), 
    updateTownshipHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    checkBlockedUser,
    validate(getTownshipSchema),
    permissionUser("delete", townshipPermission),
    deleteTownshipHandler
  )


export default router
