import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiRegionsInput } from "../../schemas/region.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.region;
/**
 * RegionService class provides methods for managing region data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to regions.
 */
export class RegionService extends AppService<
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
    super(Resource.Region, { action: OperationAction.Read, resourceIds: [] }, db.region);
    this.name = "Region";
  }

  /**
   * Creates a new instance of RegionService.
   * @returns A new instance of RegionService.
   */
  static new() {
    return new RegionService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiRegionsInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (region: CreateMultiRegionsInput[number]) => {
      const result = (await opt({
        where: { name: region.name },
        create: {
          name: region.name,
        },
        update: { updatedAt: new Date() },
      })).map_err(convertPrismaErrorToAppError);
      return result.ok_or_throw();
    };

    const result = await Promise.all(data.map(opts));
    return Ok(result);
  }
}
