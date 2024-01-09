import { Router } from "express";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { uploadExcel } from "../upload/excelUpload";
import { createCityHandler, createMultiCitiesHandler, deleteCityHandler, deleteMultilCitiesHandler, getCitiesHandler, getCityHandler, updateCityHandler } from "../controllers/city.controller";
import { createCitySchema, deleteMultiCitySchema, getCitySchema, updateCitychema } from "../schemas/city.schema";
import { cityPermission } from "../utils/auth/permissions";


const router = Router()


router.route("")
  .get(
    permissionUser("read", cityPermission),
    getCitiesHandler
  )
  .post(
    deserializeUser,
    requiredUser,
    permissionUser("create", cityPermission),
    validate(createCitySchema),
    createCityHandler
  )


router.route("/multi")
  .delete(
    deserializeUser,
    requiredUser,
    permissionUser("delete", cityPermission),
    validate(deleteMultiCitySchema),
    deleteMultilCitiesHandler
  )


// Upload Routes
router.post("/excel-upload",
  deserializeUser,
  requiredUser,
  permissionUser("create", cityPermission),
  uploadExcel,
  createMultiCitiesHandler,
)


router.route("/detail/:cityId")
  .get(
    permissionUser("read", cityPermission),
    validate(getCitySchema),
    getCityHandler
  )
  .patch(
    deserializeUser, 
    requiredUser, 
    permissionUser("update", cityPermission),
    validate(updateCitychema), 
    updateCityHandler
  )
  .delete(
    deserializeUser,
    requiredUser,
    validate(getCitySchema),
    permissionUser("delete", cityPermission),
    deleteCityHandler
  )


export default router
