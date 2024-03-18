import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiRolesInput } from "../../schemas/role.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.role;
/**
 * RoleService class provides methods for managing permission data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to roles.
 */
export class RoleService extends AppService<
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
    super(Resource.Role, { action: OperationAction.Read, resourceIds: [] }, db.role);
    this.name = "Role";
  }

  /**
   * Creates a new instance of RoleService.
   * @returns A new instance of RoleService.
   */
  static new() {
    return new RoleService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiRolesInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (role: CreateMultiRolesInput[number]) => {
      const result = (await opt({
        where: { name: role.name },
        create: { name: role.name },
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
