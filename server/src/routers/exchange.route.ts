import { Router } from "express";
import {
  createExchangeHandler,
  createMultiExchangesHandler,
  deleteExchangeHandler,
  deleteMultiExchangesHandler,
  getExchangeHandler,
  getExchangesHandler,
  updateExchangeHandler,
} from "../controllers/exchange.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import {
  createExchangeSchema,
  deleteMultiExchangesSchema,
  getExchangeSchema,
  updateExchangeSchema,
} from "../schemas/exchange.schema";
import { uploadExcel } from "../upload/excelUpload";

const router = Router();
router.use(deserializeUser, requiredUser);

router.route("")
  .get(
    getExchangesHandler,
  )
  .post(
    validate(createExchangeSchema),
    createExchangeHandler,
  );

router.route("/multi")
  .delete(
    validate(deleteMultiExchangesSchema),
    deleteMultiExchangesHandler,
  );

// Upload Routes
router.post("/excel-upload", uploadExcel, createMultiExchangesHandler);

router.route("/detail/:exchangeId")
  .get(
    validate(getExchangeSchema),
    getExchangeHandler,
  )
  .patch(
    validate(updateExchangeSchema),
    updateExchangeHandler,
  )
  .delete(
    validate(getExchangeSchema),
    deleteExchangeHandler,
  );

export default router;
