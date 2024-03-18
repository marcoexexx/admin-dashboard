import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

/**
 * ProductSalesCategoryService class provides methods for managing productSalesCategory data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to productSalesCategory.
 */
export class ProductSalesCategoryService extends AppService<
  typeof db.productSalesCategory
> {
  constructor() {
    super(Resource.SalesCategory, { action: OperationAction.Read, resourceIds: [] }, db.productSalesCategory);
    this.name = "SalesCategory";
  }

  /**
   * Creates a new instance of ProductSalesCategoryService.
   * @returns A new instance of ProductSalesCategoryService.
   */
  static new() {
    return new ProductSalesCategoryService();
  }
}
