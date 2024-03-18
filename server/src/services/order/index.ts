import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

/**
 * OrderService class provides methods for managing order data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to orders.
 */
export class OrderService extends AppService<
  typeof db.order
> {
  constructor() {
    super(Resource.Order, { action: OperationAction.Read, resourceIds: [] }, db.order);
  }

  /**
   * Creates a new instance of OrderService.
   * @returns A new instance of OrderService.
   */
  static new() {
    return new OrderService();
  }
}
