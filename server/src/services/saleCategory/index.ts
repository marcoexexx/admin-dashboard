import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiSalesCategoriesInput } from "../../schemas/salesCategory.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.salesCategory;
/**
 * SalesCategoryService class provides methods for managing salesCategory data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to salesCategory.
 */
export class SalesCategoryService extends AppService<
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
    super(Resource.SalesCategory, { action: OperationAction.Read, resourceIds: [] }, db.salesCategory);
    this.name = "SalesCategory";
  }

  /**
   * Creates a new instance of SalesCategoryService.
   * @returns A new instance of SalesCategoryService.
   */
  static new() {
    return new SalesCategoryService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiSalesCategoriesInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (salesCategory: CreateMultiSalesCategoriesInput[number]) => {
      const result = (await opt({
        where: {
          name: salesCategory.name,
        },
        create: {
          name: salesCategory.name,
          image: salesCategory.image,
          startDate: salesCategory.startDate,
          endDate: salesCategory.endDate,
          isActive: salesCategory.isActive,
          description: salesCategory.description,
        },
        update: { updatedAt: new Date() },
      })).map_err(convertPrismaErrorToAppError);
      return result.ok_or_throw();
    };

    const result = await Promise.all(data.map(opts));
    return Ok(result);
  }
}
