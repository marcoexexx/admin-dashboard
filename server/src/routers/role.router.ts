import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { createMultiRolesHandler, createRoleHandler, deleteMultiRolesHandler, getRolesHandler, updateRoleHandler } from "../controllers/role.controller";
import { createRoleSchema, deleteMultiRolesSchema, getRoleSchema, updateRoleSchema } from "../schemas/role.schema";


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
    validate(deleteMultiRolesSchema),
    deleteMultiRolesHandler
  )


// Upload Routes
router.post("/excel-upload",
  uploadExcel,
  createMultiRolesHandler
)


router.route("/detail/:roleId")
  .get(
    validate(getRoleSchema),
    getRolesHandler
  )
  .patch(
    validate(updateRoleSchema), 
    updateRoleHandler
  )
  .delete(
    validate(getRoleSchema),
    deleteMultiRolesHandler
  )


export default router 

