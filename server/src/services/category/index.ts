import fs from "fs";
import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Category, Prisma } from "@prisma/client";
import { AppService, Pagination } from "../type";
import { CreateMultiCategoriesInput } from "../../schemas/category.schema";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { parseExcel } from "../../utils/parseExcel";



/**
 * CategoryService class provides methods for managing access log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 */
export class CategoryService implements AppService {
  private repository = db.category

  /**
   * Creates a new instance of CategoryService.
   * @returns A new instance of CategoryService.
   */
  static new() { return new CategoryService() }


  async find(arg: { filter?: Prisma.CategoryWhereInput; pagination: Pagination; include?: Prisma.CategoryInclude, orderBy?: Prisma.CategoryOrderByWithRelationInput }): Promise<Result<[number, Category[]], AppError>> {
    const { filter, include, pagination, orderBy = {updatedAt: "desc"} } = arg
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


  async delete(id: string): Promise<Result<Category, AppError>> {
    const tryDelete = as_result_async(this.repository.delete)

    const try_delete = (await tryDelete({ where: { id } })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_delete
  }


  async findUnique(id: string, include?: Prisma.CategoryInclude): Promise<Result<Category | null, AppError>> {
    const tryUnique = as_result_async(this.repository.findUnique)

    const try_data = (await tryUnique({ where: { id }, include })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  async findFirst(_payload: any, _include?: Prisma.CategoryInclude): Promise<Result<Category | null, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async create(payload: Prisma.CategoryCreateInput): Promise<Result<Category, AppError>> {
    const tryCreate = as_result_async(this.repository.create)

    const try_data = (await tryCreate({ data: payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  // Data create by uploading excel 
  // Update not affected
  async excelUpload(file: Express.Multer.File): Promise<Result<Category[], AppError>> {
    const buf = fs.readFileSync(file.path)
    const data = parseExcel(buf) as CreateMultiCategoriesInput

    const tryUpsert = as_result_async(this.repository.upsert)

    const tryCreateOrUpdate = async (brand: CreateMultiCategoriesInput[number]) => (await tryUpsert({
      where: { name: brand.name },
      create: { name: brand.name },
      update: { updatedAt: new Date() }
    })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    }).ok_or_throw()

    const result = await Promise.all(data.map(tryCreateOrUpdate))

    return Ok(result)
  }


  async update(arg: { filter: Prisma.CategoryWhereUniqueInput; payload: Prisma.CategoryUpdateInput; }): Promise<Result<Category, AppError>> {
    const tryUpdate = as_result_async(this.repository.update)

    const try_data = (await tryUpdate({ where: arg.filter, data: arg.payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  async deleteMany(arg: { filter: Prisma.CategoryWhereInput }): Promise<Result<any, AppError>> {
    const tryDeleteMany = as_result_async(this.repository.deleteMany)

    const try_data = (await tryDeleteMany({ where: arg.filter })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }
}

