import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { validate } from "../middleware/validate";
import { createCouponHandler, createMultiCouponsHandler, deleteCouponHandler, deleteMultiCouponsHandler, getCouponHandler, getCouponsHandler, updateCouponHandler } from "../controllers/coupon.controller";
import { createCouponSchema, deleteMultiCouponsSchema, getCouponSchema, updateCouponSchema } from "../schemas/coupon.schema";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("/")
  .get(
    getCouponsHandler
  )
  .post(
    validate(createCouponSchema),
    createCouponHandler
  )


router.route("/multi")
  .delete(
    validate(deleteMultiCouponsSchema),
    deleteMultiCouponsHandler
  )


// Upload Routes
router.post("/excel-upload",
  uploadExcel,
  createMultiCouponsHandler
)


router.route("/detail/:couponId")
  .get(
    validate(getCouponSchema),
    getCouponHandler
  )
  .patch(
    validate(updateCouponSchema), 
    updateCouponHandler
  )
  .delete(
    validate(getCouponSchema),
    deleteCouponHandler
  )


export default router 
