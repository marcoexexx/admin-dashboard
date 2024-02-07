import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { ProductSalesCategory, Prisma } from "@prisma/client";
import { AppService, Pagination } from "../type";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";


/**
 * ProductSalesCategoryService class provides methods for managing access log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 */
export class ProductSalesCategoryService implements AppService {
  private repository = db.productSalesCategory

  /**
   * Creates a new instance of ProductSalesCategoryService.
   * @returns A new instance of ProductSalesCategoryService.
   */
  static new() { return new ProductSalesCategoryService() }


  // Find implements
  async find(arg: { filter?: Prisma.ProductSalesCategoryWhereInput; pagination: Pagination; include?: Prisma.ProductSalesCategoryInclude, orderBy?: Prisma.ProductSalesCategoryOrderByWithRelationInput }): Promise<Result<[number, ProductSalesCategory[]], AppError>> {
    const { filter, include, pagination, orderBy } = arg
    const { page = 1, pageSize = 10 } = pagination
    const offset = (page - 1) * pageSize

    const try_data = await db
      .$transaction([
        this.repository.count(),
        this.repository.findMany({
          where: filter,
          include,
          skip: offset,
          take: pagination.pageSize,
          orderBy
        })
      ])
      .then(Ok)
      .catch(err => {
        if (err instanceof PrismaClientKnownRequestError) return Err(convertPrismaErrorToAppError(err))
        if (err instanceof PrismaClientValidationError) return Err(AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`))
        return Err(AppError.new(StatusCode.InternalServerError, err?.message))
      })

    return try_data
  }


  // Delete implements
  async delete(id: string): Promise<Result<ProductSalesCategory, AppError>> {
    const tryDelete = as_result_async(this.repository.delete)

    const try_delete = (await tryDelete({ where: { id } })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_delete
  }


  async findMany(arg: { where: Prisma.ProductSalesCategoryWhereInput; include: Prisma.ProductSalesCategoryInclude; }): Promise<Result<ProductSalesCategory[], AppError>> {
    const tryDelete = as_result_async(this.repository.findMany)

    const try_delete = (await tryDelete({ where: arg.where, include: arg.include })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_delete
  }


  async findUnique(_id: string, _include?: any): Promise<Result<ProductSalesCategory | null, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async findFirst(_payload: any, _include?: Prisma.AccessLogInclude): Promise<Result<any, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async create(payload: Prisma.ProductSalesCategoryUncheckedCreateInput): Promise<Result<any, AppError>> {
    const tryCreate = as_result_async(this.repository.create)

    const try_data = (await tryCreate({ data: payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  async excelUpload(_file: Express.Multer.File): Promise<Result<any, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }

  async update(_arg: { filter: any; payload: any; }): Promise<Result<any, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async deleteMany(_arg: { filter: any; }): Promise<Result<any, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }
}

