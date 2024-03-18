import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiShopownersInput } from "../../schemas/shopowner.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.shopownerProvider;
/**
 * ShopownerService class provides methods for managing shopowner data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to shopowners.
 */
export class ShopownerService extends AppService<
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
    super(Resource.Shopowner, { action: OperationAction.Read, resourceIds: [] }, db.shopownerProvider);
    this.name = "shopownerProvider";
  }

  /**
   * Creates a new instance of ShopownerService.
   * @returns A new instance of ShopownerService.
   */
  static new() {
    return new ShopownerService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiShopownersInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (shopowner: CreateMultiShopownersInput[number]) => {
      const result = (await opt({
        where: { name: shopowner.name },
        create: { name: shopowner.name },
        update: { updatedAt: new Date() },
      })).map_err(convertPrismaErrorToAppError);
      return result.ok_or_throw();
    };

    const result = await Promise.all(data.map(opts));

    this.log = {
      action: OperationAction.Create,
      resourceIds: result.map(x => x.id),
    };
    return Ok(result);
  }
}
