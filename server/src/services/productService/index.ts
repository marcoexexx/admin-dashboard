import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import {
  OperationAction,
  ProductStatus,
  Resource,
  User,
} from "@prisma/client";
import { CreateMultiProductsInput } from "../../schemas/product.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

const repository = db.product;
/**
 * ProductService class provides methods for managing product data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to products.
 */
export class ProductService extends AppService<
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
    super(Resource.Product, {
      action: OperationAction.Read,
      resourceIds: [],
    }, db.product);
    this.name = "Product";
  }

  /**
   * Creates a new instance of ProductService.
   * @returns A new instance of ProductService.
   */
  static new() {
    return new ProductService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File, uploadBy: User): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiProductsInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (product: CreateMultiProductsInput[number]) => {
      const sale = (product["sales.name"] && product["sales.discount"])
        ? {
          name: product["sales.name"].toString(),
          startDate: product["sales.startDate"] || new Date(),
          get endDate() {
            return product["sales.endDate"]
              || new Date(
                new Date(this.startDate).getTime()
                  + 1000 * 60 * 60 * 24 * 5,
              );
          }, // default: 5 days
          discount: product["sales.discount"],
          isActive: product["sales.isActive"] || true,
          description: product["sales.description"],
        }
        : null;

      const result = (await opt({
        where: {
          itemCode: product.itemCode,
          status: ProductStatus.Draft,
          creator: {
            shopownerProviderId: uploadBy.isSuperuser
              ? undefined
              : uploadBy.shopownerProviderId,
          },
        },
        create: {
          itemCode: product.itemCode,
          title: product.title,
          overview: product.overview,
          instockStatus: product.instockStatus,
          description: product.description,
          price: product.price,
          dealerPrice: product.dealerPrice,
          marketPrice: product.marketPrice,
          priceUnit: product.priceUnit,
          images: (product?.images || "")?.split("\n").filter(Boolean),
          quantity: product.quantity,
          discount: product.discount,
          isDiscountItem: product.isDiscountItem,
          brand: {
            connectOrCreate: {
              where: { name: product["brand.name"] },
              create: { name: product["brand.name"] },
            },
          },
          creator: {
            connect: {
              id: uploadBy.id,
            },
          },
          salesCategory: {
            create: sale
              ? {
                salesCategory: {
                  connectOrCreate: {
                    where: { name: sale.name },
                    create: {
                      name: sale.name,
                      startDate: sale.startDate,
                      endDate: sale.endDate,
                      isActive: sale.isActive,
                      description: sale.description,
                    },
                  },
                },
                discount: sale.discount,
              }
              : undefined,
          },
          specification: product.specification
            ? {
              createMany: {
                data: product.specification.split("\n").filter(Boolean)
                  .map(spec => ({
                    name: spec.split(": ")[0],
                    value: spec.split(": ")[1],
                  })),
              },
            }
            : undefined,
          categories: {
            create: (product.categories || "").split("\n").filter(Boolean)
              .map(name => ({
                category: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
          },
        },
        update: {
          title: product.title,
          price: product.price,
          discount: product.discount,
          isDiscountItem: product.isDiscountItem,
          dealerPrice: product.dealerPrice,
          marketPrice: product.marketPrice,
          salesCategory: {
            create: sale
              ? {
                salesCategory: {
                  connectOrCreate: {
                    where: { name: sale.name },
                    create: {
                      name: sale.name,
                      startDate: sale.startDate,
                      endDate: sale.endDate,
                      isActive: sale.isActive,
                      description: sale.description,
                    },
                  },
                },
                discount: sale.discount,
              }
              : undefined,
          },
          updatedAt: new Date(),
        },
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
