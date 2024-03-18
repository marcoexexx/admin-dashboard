import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

/**
 * OrderService class provides methods for managing order data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to items of order.
 */
export class OrderItemService extends AppService<
  typeof db.orderItem
> {
  constructor() {
    super(Resource.OrderItem, { action: OperationAction.Read, resourceIds: [] }, db.orderItem);
  }

  /**
   * Creates a new instance of OrderItemService.
   * @returns A new instance of OrderItemService.
   */
  static new() {
    return new OrderItemService();
  }
}
