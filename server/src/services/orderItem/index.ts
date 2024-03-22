import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.orderItem;
/**
 * OrderService class provides methods for managing order data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to items of order.
 */
export class OrderItemService extends AppService<
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
    super(Resource.OrderItem, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.orderItem);
    this.name = "OrderItem";
  }

  /**
   * Creates a new instance of OrderItemService.
   * @returns A new instance of OrderItemService.
   */
  static new() {
    return new OrderItemService();
  }
}
