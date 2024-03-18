import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.productSalesCategory;
/**
 * ProductSalesCategoryService class provides methods for managing productSalesCategory data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to productSalesCategory.
 */
export class ProductSalesCategoryService extends AppService<
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
