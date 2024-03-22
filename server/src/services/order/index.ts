import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.order;
/**
 * OrderService class provides methods for managing order data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to orders.
 */
export class OrderService extends AppService<
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
    super(Resource.Order, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.order);
    this.name = "Order";
  }

  /**
   * Creates a new instance of OrderService.
   * @returns A new instance of OrderService.
   */
  static new() {
    return new OrderService();
  }
}
