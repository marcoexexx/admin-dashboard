import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiBrandsInput } from "../../schemas/brand.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.brand;
/**
 * BrandService class provides methods for managing brand data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to brands.
 */
export class BrandService extends AppService<
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
    super(Resource.Brand, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.brand);
    this.name = "Brand";
  }

  /**
   * Creates a new instance of BrandService.
   * @returns A new instance of BrandService.
   */
  static new() {
    return new BrandService();
  }

  // Data create by uploading excel
  // Update not affected
  override async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiBrandsInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (brand: CreateMultiBrandsInput[number]) => {
      const result = (await opt({
        where: { name: brand.name },
        create: { name: brand.name },
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
