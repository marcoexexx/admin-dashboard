import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.accessLog;
/**
 * AccessLogService class provides methods for managing access log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 */
export class AccessLogService extends AppService<
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
    super(Resource.AccessLog, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.accessLog);
    this.name = "AccessLog";
  }

  /**
   * Creates a new instance of AccessLogService.
   * @returns A new instance of AccessLogService.
   */
  static new() {
    return new AccessLogService();
  }
}
