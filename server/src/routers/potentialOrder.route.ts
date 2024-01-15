import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { validate } from "../middleware/validate";
import { potentialOrderPermission } from "../utils/auth/permissions";
import { createPotentialOrderSchema, deleteMultiPotentialOrdersSchema, getPotentialOrderSchema, updatePotentialOrderSchema } from "../schemas/potentialOrder.schema";
import { createPotentialOrderHandler, deleteMultiPotentialOrdersHandler, deletePotentialOrderHandler, getPotentialOrderHandler, getPotentialOrdersHandler, updatePotentialOrderHandler } from "../controllers/potentialOrder.controller";


const router = Router()

router.use(deserializeUser, requiredUser)


router.route("/")
  .get(
    permissionUser("read", potentialOrderPermission),
    getPotentialOrdersHandler
  )
  .post(
    permissionUser("create", potentialOrderPermission),
    validate(createPotentialOrderSchema),
    createPotentialOrderHandler
  )


router.route("/multi")
  .delete(
    permissionUser("delete", potentialOrderPermission),
    validate(deleteMultiPotentialOrdersSchema),
    deleteMultiPotentialOrdersHandler
  )


// // Upload Routes
// router.post("/excel-upload",
//   permissionUser("create", orderPermission),
//   uploadExcel,
//   createMultiCouponsHandler
// )


router.route("/detail/:potentialOrderId")
  .get(
    permissionUser("read", potentialOrderPermission),
    validate(getPotentialOrderSchema),
    getPotentialOrderHandler
  )
  .patch(
    permissionUser("update", potentialOrderPermission),
    validate(updatePotentialOrderSchema), 
    updatePotentialOrderHandler
  )
  .delete(
    permissionUser("delete", potentialOrderPermission),
    validate(getPotentialOrderSchema),
    deletePotentialOrderHandler
  )


export default router 

