import { Router } from "express";
import {
  createPotentialOrderHandler,
  deleteMultiPotentialOrdersHandler,
  deletePotentialOrderHandler,
  getPotentialOrderHandler,
  getPotentialOrdersHandler,
  updatePotentialOrderHandler,
} from "../controllers/potentialOrder.controller";
import { checkBlockedUser } from "../middleware/checkBlockedUser";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createPotentialOrderSchema,
  deleteMultiPotentialOrdersSchema,
  getPotentialOrderSchema,
  updatePotentialOrderSchema,
} from "../schemas/potentialOrder.schema";

const router = Router();

router.use(deserializeUser, requiredUser, checkBlockedUser);

router.route("/")
  .get(
    getPotentialOrdersHandler,
  )
  .post(
    validate(createPotentialOrderSchema),
    createPotentialOrderHandler,
  );

router.route("/multi")
  .delete(
    validate(deleteMultiPotentialOrdersSchema),
    deleteMultiPotentialOrdersHandler,
  );

// // Upload Routes
// router.post("/excel-upload",
//   permissionUser("create", orderPermission),
//   uploadExcel,
//   createMultiCouponsHandler
// )

router.route("/detail/:potentialOrderId")
  .get(
    validate(getPotentialOrderSchema),
    getPotentialOrderHandler,
  )
  .patch(
    validate(updatePotentialOrderSchema),
    updatePotentialOrderHandler,
  )
  .delete(
    validate(getPotentialOrderSchema),
    deletePotentialOrderHandler,
  );

export default router;
