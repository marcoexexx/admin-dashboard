import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { AppService, Pagination } from "../type";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";


/**
 * ProductSalesCategoryService class provides methods for managing productSalesCategory data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to productSalesCategory.
 */
export class ProductSalesCategoryService implements AppService {
  private repository = db.productSalesCategory

  /**
   * Creates a new instance of ProductSalesCategoryService.
   * @returns A new instance of ProductSalesCategoryService.
   */
  static new() { return new ProductSalesCategoryService() }

  async tryCount(): Promise<Result<number, AppError>> {
    const opt = as_result_async(this.repository.count)

    const result = (await opt()).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }


  async tryFindManyWithCount(...args: [{ pagination: Pagination; }, ...Parameters<typeof this.repository.findMany>]): Promise<
    Result<[number, Awaited<ReturnType<typeof this.repository.findMany>>], AppError>
  > {
    const [{pagination}, arg] = args
    const { page = 1, pageSize = 10 } = pagination
    const offset = (page - 1) * pageSize

    const opt = as_result_async(this.repository.findMany)

    const count = await this.tryCount()
    if (count.is_err()) return Err(count.unwrap_err())

    const result = (await opt({ ...arg, skip: offset, take: pageSize })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })
    if (result.is_err()) return Err(result.unwrap_err())

    return Ok([count.unwrap(), result.unwrap()])
  }


  async tryFindUnique(...args: Parameters<typeof this.repository.findUnique>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.findUnique>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.findUnique)

    const result = (await opt(arg)).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }


  async tryFindFirst(...args: Parameters<typeof this.repository.findFirst>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.findFirst>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.findFirst)

    const result = (await opt(arg)).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }


  async tryCreate(...args: Parameters<typeof this.repository.create>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.create>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.create)

    const result = (await opt(arg)).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }


  async tryExcelUpload(_args: any): Promise<Result<any, AppError>> {
    return Err(AppError.new(StatusCode.ServiceUnavailable, `This feature is not implemented yet.`))
  }


  async tryUpdate(...args: Parameters<typeof this.repository.update>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.update>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.update)

    const result = (await opt(arg)).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }


  async tryDelete(...args: Parameters<typeof this.repository.delete>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.delete>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.delete)

    const result = (await opt(arg)).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }


  async tryDeleteMany(...args: Parameters<typeof this.repository.deleteMany>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.deleteMany>>, AppError>
  > {
    const [arg] = args

    const opt = as_result_async(this.repository.deleteMany)

    const result = (await opt(arg)).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return result
  }
}

