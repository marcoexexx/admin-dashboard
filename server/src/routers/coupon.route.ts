import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";
import { permissionUser } from "../middleware/permissionUser";
import { couponPermission } from "../utils/auth/permissions/coupon.permisson";
import { validate } from "../middleware/validate";
import { createCouponHandler, createMultiCouponsHandler, deleteCouponHandler, deleteMultiCouponsHandler, getCouponHandler, getCouponsHandler, updateCouponHandler } from "../controllers/coupon.controller";
import { createCouponSchema, deleteMultiCouponsSchema, getCouponSchema, updateCouponSchema } from "../schemas/coupon.schema";
import { uploadExcel } from "../upload/excelUpload";
import { checkBlockedUser } from "../middleware/checkBlockedUser";


const router = Router()

router.use(deserializeUser, requiredUser, checkBlockedUser)


router.route("/")
  .get(
    permissionUser("read", couponPermission),
    getCouponsHandler
  )
  .post(
    permissionUser("create", couponPermission),
    validate(createCouponSchema),
    createCouponHandler
  )


router.route("/multi")
  .delete(
    permissionUser("delete", couponPermission),
    validate(deleteMultiCouponsSchema),
    deleteMultiCouponsHandler
  )


// Upload Routes
router.post("/excel-upload",
  permissionUser("create", couponPermission),
  uploadExcel,
  createMultiCouponsHandler
)


router.route("/detail/:couponId")
  .get(
    permissionUser("read", couponPermission),
    validate(getCouponSchema),
    getCouponHandler
  )
  .patch(
    permissionUser("update", couponPermission),
    validate(updateCouponSchema), 
    updateCouponHandler
  )
  .delete(
    permissionUser("delete", couponPermission),
    validate(getCouponSchema),
    deleteCouponHandler
  )


export default router 
