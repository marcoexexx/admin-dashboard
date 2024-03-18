import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.potentialOrder;
/**
 * PotentialOrderService class provides methods for managing potentialOrder data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to potentialOrder.
 */
export class PotentialOrderService extends AppService<
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
    super(Resource.PotentialOrder, { action: OperationAction.Read, resourceIds: [] }, db.potentialOrder);
    this.name = "PotentialOrder";
  }

  /**
   * Creates a new instance of PotentialOrderService.
   * @returns A new instance of PotentialOrderService.
   */
  static new() {
    return new PotentialOrderService();
  }
}
