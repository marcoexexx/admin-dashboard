import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { createMultiShopownersHandler, createShopownerHandler, deleteMultiShopownersHandler, deleteShopownerHandler, getShopownerHandler, getShopownersHandler, updateShopownerHandler } from "../controllers/shopowner.controller";
import { createShopownerSchema, deleteMultiShopownersSchema, getShopownerSchema, updateShopownerSchema } from "../schemas/shopowner.schema";
import { sudo } from "../middleware/sudo";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("/")
  .get(
    getShopownersHandler
  )
  .post(
    validate(createShopownerSchema),
    createShopownerHandler
  )


router.route("/multi")
  .delete(
    sudo,
    validate(deleteMultiShopownersSchema),
    deleteMultiShopownersHandler
  )


// Upload Routes
router.post("/excel-upload",
  sudo,
  uploadExcel,
  createMultiShopownersHandler
)


router.route("/detail/:shopownerId")
  .get(
    validate(getShopownerSchema),
    getShopownerHandler
  )
  .patch(
    sudo,
    validate(updateShopownerSchema), 
    updateShopownerHandler
  )
  .delete(
    sudo,
    validate(getShopownerSchema),
    deleteShopownerHandler
  )


export default router 
