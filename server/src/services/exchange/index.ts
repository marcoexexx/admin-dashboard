import fs from "fs";
import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Exchange, Prisma } from "@prisma/client";
import { AppService, Pagination } from "../type";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { parseExcel } from "../../utils/parseExcel";
import { CreateMultiExchangesInput } from "../../schemas/exchange.schema";



/**
 * ExchangeService class provides methods for managing access log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 */
export class ExchangeService implements AppService {
  private repository = db.exchange

  /**
   * Creates a new instance of ExchangeService.
   * @returns A new instance of ExchangeService.
   */
  static new() { return new ExchangeService() }


  async find(arg: { filter?: Prisma.ExchangeWhereInput; pagination: Pagination; orderBy?: Prisma.ExchangeOrderByWithRelationInput }): Promise<Result<[number, Exchange[]], AppError>> {
    const { filter, pagination, orderBy = {updatedAt: "desc"} } = arg
    const { page = 1, pageSize = 10 } = pagination
    const offset = (page - 1) * pageSize

    const try_data = await db
      .$transaction([
        this.repository.count(),
        this.repository.findMany({
          where: filter,
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


  async delete(id: string): Promise<Result<Exchange, AppError>> {
    const tryDelete = as_result_async(this.repository.delete)

    const try_delete = (await tryDelete({ where: { id } })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_delete
  }


  async findUnique(id: string): Promise<Result<Exchange | null, AppError>> {
    const tryUnique = as_result_async(this.repository.findUnique)

    const try_data = (await tryUnique({ where: { id } })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  async findFirst(_payload: any): Promise<Result<Exchange | null, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async create(payload: Prisma.ExchangeCreateInput): Promise<Result<Exchange, AppError>> {
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
  async excelUpload(file: Express.Multer.File): Promise<Result<Exchange[], AppError>> {
    const buf = fs.readFileSync(file.path)
    const data = parseExcel(buf) as CreateMultiExchangesInput

    const tryUpsert = as_result_async(this.repository.upsert)

    const tryCreateOrUpdate = async (exchange: CreateMultiExchangesInput[number]) => (await tryUpsert({
      where: { 
        id: exchange.id
      },
      create: { 
        id: exchange.id,
        to: exchange.to,
        from: exchange.from,
        rate: exchange.rate,
        date: exchange.date
      },
      update: { 
        to: exchange.to,
        from: exchange.from,
        rate: exchange.rate,
        date: exchange.date,
        updatedAt: new Date() 
      }
    })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    }).ok_or_throw()

    const result = await Promise.all(data.map(tryCreateOrUpdate))

    return Ok(result)
  }


  async update(arg: { filter: Prisma.ExchangeWhereUniqueInput; payload: Prisma.ExchangeUpdateInput; }): Promise<Result<Exchange, AppError>> {
    const tryUpdate = as_result_async(this.repository.update)

    const try_data = (await tryUpdate({ where: arg.filter, data: arg.payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  async deleteMany(arg: { filter: Prisma.ExchangeWhereInput }): Promise<Result<Prisma.BatchPayload, AppError>> {
    const tryDeleteMany = as_result_async(this.repository.deleteMany)

    const try_data = (await tryDeleteMany({ where: arg.filter })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }
}

