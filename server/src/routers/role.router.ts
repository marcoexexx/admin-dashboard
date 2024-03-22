import { Router } from "express";
import {
  createMultiRolesHandler,
  createRoleHandler,
  deleteMultiRolesHandler,
  getRoleHandler,
  getRolesHandler,
  updateRoleHandler,
} from "../controllers/role.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { sudo } from "../middleware/sudo";
import { validate } from "../middleware/validate";
import {
  createRoleSchema,
  deleteMultiRolesSchema,
  getRoleSchema,
  updateRoleSchema,
} from "../schemas/role.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("/")
  .get(
    getRolesHandler,
  )
  .post(
    validate(createRoleSchema),
    createRoleHandler,
  );

router.route("/multi")
  .delete(
    sudo,
    validate(deleteMultiRolesSchema),
    deleteMultiRolesHandler,
  );

// Upload Routes
router.post("/excel-upload", sudo, uploadExcel, createMultiRolesHandler);

router.route("/detail/:roleId")
  .get(
    validate(getRoleSchema),
    getRoleHandler,
  )
  .patch(
    sudo,
    validate(updateRoleSchema),
    updateRoleHandler,
  )
  .delete(
    sudo,
    validate(getRoleSchema),
    deleteMultiRolesHandler,
  );

export default router;
