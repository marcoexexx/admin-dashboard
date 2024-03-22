import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiCouponsInput } from "../../schemas/coupon.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.coupon;
/**
 * CouponService class provides methods for managing coupon data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to coupon.
 */
export class CouponService extends AppService<
  typeof repository.count,
  typeof repository.create,
  typeof repository.findMany,
  typeof repository.findUnique,
  typeof repository.findFirst,
  typeof repository.update,
  typeof repository.delete,
  typeof repository.deleteMany,
  typeof repository.upsert,
  typeof repository
> {
  constructor() {
    super(Resource.Coupon, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.coupon);
    this.name = "Coupon";
  }

  /**
   * Creates a new instance of CouponService.
   * @returns A new instance of CouponService.
   */
  static new() {
    return new CouponService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiCouponsInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (coupon: CreateMultiCouponsInput[number]) => {
      const result = (await opt({
        where: {
          label: coupon.label,
        },
        create: {
          label: coupon.label,
          points: coupon.points,
          dolla: coupon.dolla,
          productId: coupon.productId,
          isUsed: coupon.isUsed,
          expiredDate: coupon.expiredDate,
        },
        update: { updatedAt: new Date() },
      })).map_err(convertPrismaErrorToAppError);
      return result.ok_or_throw();
    };

    const result = await Promise.all(data.map(opts));

    return Ok(result);
  }
}
