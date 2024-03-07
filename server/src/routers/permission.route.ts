import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { createMultiPermissionsHandler, createPermissionHandler, deleteMultiPermissionsHandler, deletePermissionHandler, getPermissionHandler, getPermissionsHandler, updatePermissionHandler } from "../controllers/permission.controller";
import { createPermissionSchema, deleteMultiPermissionsSchema, getPermissionSchema, updatePermissionSchema } from "../schemas/permission.schema";
import { sudo } from "../middleware/sudo";


const router = Router()

router.use(deserializeUser, requiredUser, sudo, checkBlockedUser)


router.route("/")
  .get(
    getPermissionsHandler
  )
  .post(
    validate(createPermissionSchema),
    createPermissionHandler
  )


router.route("/multi")
  .delete(
    validate(deleteMultiPermissionsSchema),
    deleteMultiPermissionsHandler
  )


// Upload Routes
router.post("/excel-upload",
  uploadExcel,
  createMultiPermissionsHandler
)


router.route("/detail/:permissionId")
  .get(
    validate(getPermissionSchema),
    getPermissionHandler
  )
  .patch(
    validate(updatePermissionSchema), 
    updatePermissionHandler
  )
  .delete(
    validate(getPermissionSchema),
    deletePermissionHandler
  )


export default router 
