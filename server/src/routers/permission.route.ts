import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { createMultiPermissionsHandler, createPermissionHandler, deleteMultiPermissionsHandler, deletePermissionHandler, getPermissionsHandler, updatePermissionHandler } from "../controllers/permission.controller";
import { createPermissionSchema, deleteMultiPermissionsSchema, getPermissionSchema, updatePermissionSchema } from "../schemas/permission.schema";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


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
    getPermissionsHandler
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
