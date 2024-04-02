import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiCategoriesInput } from "../../schemas/category.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.category;
/**
 * CategoryService class provides methods for managing category data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to categories.
 */
export class CategoryService extends AppService<
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
    super(Resource.Category, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.category);
    this.name = "Category";
  }

  /**
   * Creates a new instance of CategoryService.
   * @returns A new instance of CategoryService.
   */
  static new() {
    return new CategoryService();
  }

  // Data create by uploading excel
  // Update not affected
  override async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiCategoriesInput;

    const tryUpsert = as_result_async(this.repository.upsert);

    const opts = async (category: CreateMultiCategoriesInput[number]) => {
      const result = (await tryUpsert({
        where: { name: category.name },
        create: { name: category.name },
        update: { updatedAt: new Date() },
      })).map_err(convertPrismaErrorToAppError);
      return result.ok_or_throw();
    };

    const result = await Promise.all(data.map(opts));

    return Ok(result);
  }
}
