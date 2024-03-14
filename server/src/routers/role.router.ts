import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { createMultiRolesHandler, createRoleHandler, deleteMultiRolesHandler, getRoleHandler, getRolesHandler, updateRoleHandler } from "../controllers/role.controller";
import { createRoleSchema, deleteMultiRolesSchema, getRoleSchema, updateRoleSchema } from "../schemas/role.schema";
import { sudo } from "../middleware/sudo";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("/")
  .get(
    getRolesHandler
  )
  .post(
    validate(createRoleSchema),
    createRoleHandler
  )


router.route("/multi")
  .delete(
    sudo,
    validate(deleteMultiRolesSchema),
    deleteMultiRolesHandler
  )


// Upload Routes
router.post("/excel-upload",
  sudo,
  uploadExcel,
  createMultiRolesHandler
)


router.route("/detail/:roleId")
  .get(
    validate(getRoleSchema),
    getRoleHandler
  )
  .patch(
    sudo,
    validate(updateRoleSchema), 
    updateRoleHandler
  )
  .delete(
    sudo,
    validate(getRoleSchema),
    deleteMultiRolesHandler
  )


export default router 

