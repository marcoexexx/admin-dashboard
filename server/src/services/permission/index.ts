import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiPermissionsInput } from "../../schemas/permission.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

/**
 * PermissionService class provides methods for managing permission data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to permissions.
 */
export class PermissionService extends AppService<
  typeof db.permission
> {
  constructor() {
    super(Resource.Permission, { action: OperationAction.Read, resourceIds: [] }, db.permission);
  }

  /**
   * Creates a new instance of PermissionService.
   * @returns A new instance of PermissionService.
   */
  static new() {
    return new PermissionService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiPermissionsInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (perm: CreateMultiPermissionsInput[number]) => {
      const result = (await opt({
        where: { id: perm.id },
        create: {
          action: perm.action,
          resource: perm.resource,
        },
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
