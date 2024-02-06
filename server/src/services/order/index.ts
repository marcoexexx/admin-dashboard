import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Order, Prisma, Role, User } from "@prisma/client";
import { Pagination } from "../type";
import { db } from "../../utils/db";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";


/**
 * OrderService class provides methods for managing access log data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 */
export class OrderService implements OrderService {
  private repository = db.order

  /**
   * Creates a new instance of BrandService.
   * @returns A new instance of BrandService.
   */
  static new() { return new OrderService() }


  async find(arg: { filter?: Prisma.OrderWhereInput; pagination: Pagination; include?: Prisma.OrderInclude, orderBy?: Prisma.OrderOrderByWithRelationInput }): Promise<Result<[number, Order[]], AppError>> {
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


  async delete(id: string, { sessionUser }: { sessionUser: User}): Promise<Result<Order, AppError>> {
    const try_data = await db
      .$transaction([
        db.orderItem.deleteMany({
          where: {
            order: {
              id,
              userId: sessionUser.role === Role.Admin ? undefined : sessionUser.id
            },
          }
        }),

        db.pickupAddress.deleteMany({
          where: {
            orders: {
              some: {
                id,
                userId: sessionUser.role === Role.Admin ? undefined : sessionUser.id
              }
            }
          }
        }),

        db.order.delete({
          where: {
            id,
            userId: sessionUser.role === Role.Admin ? undefined : sessionUser.id
          }
        })
      ])
      .then(([_deletedOrderItems, _deletedPickupAddress, order]) => Ok(order))
      .catch(err => {
        if (err instanceof PrismaClientKnownRequestError) return Err(convertPrismaErrorToAppError(err))
        if (err instanceof PrismaClientValidationError) return Err(AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`))
        return Err(AppError.new(StatusCode.InternalServerError, err?.message))
      })

    return try_data
  }


  async findUnique(id: string, include?: Prisma.OrderInclude, select?: Prisma.OrderSelect): Promise<Result<Order | null, AppError>> {
    const tryUnique = as_result_async(this.repository.findUnique)

    const try_data = (await tryUnique({ where: { id }, include, select })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  async findFirst(_payload: any, _include?: Prisma.OrderInclude): Promise<Result<Order | null, AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async create(payload: Prisma.OrderUncheckedCreateInput): Promise<Result<Order, AppError>> {
    const tryCreate = as_result_async(this.repository.create)

    const try_data = (await tryCreate({ data: payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  // Data create by uploading excel 
  async excelUpload(_file: Express.Multer.File): Promise<Result<Order[], AppError>> {
    return Err(AppError.new(StatusCode.InternalServerError, `This feature is not implemented yet.`))
  }


  async update(arg: { filter: Prisma.OrderWhereUniqueInput; payload: Prisma.OrderUncheckedUpdateInput; }): Promise<Result<Order, AppError>> {
    const try_data = await db
      .$transaction([
        db.orderItem.deleteMany({
          where: {
            orderId: arg.filter.id
          }
        }),
        db.order.update({
          where: {
            id: arg.filter.id,
          },
          data: arg.payload
        })
      ])
      .then(([_deletedOrderItems, order]) => Ok(order))
      .catch(err => {
        if (err instanceof PrismaClientKnownRequestError) return Err(convertPrismaErrorToAppError(err))
        if (err instanceof PrismaClientValidationError) return Err(AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`))
        return Err(AppError.new(StatusCode.InternalServerError, err?.message))
      })

    return try_data
  }


  async deleteMany(ids: string[], { sessionUser }: { sessionUser: User }): Promise<Result<[Prisma.BatchPayload, Prisma.BatchPayload, Prisma.BatchPayload], AppError>> {
    const try_data = await db
      .$transaction([
        db.orderItem.deleteMany({
          where: {
            order: {
              id: {
                in: ids,
              },
              userId: sessionUser.role === Role.Admin ? undefined : sessionUser.id
            }
          }
        }),

        db.pickupAddress.deleteMany({
          where: {
            orders: {
              some: {
                id: {
                  in: ids,
                },
                userId: sessionUser.role === Role.Admin ? undefined : sessionUser.id
              }
            }
          }
        }),

        db.order.deleteMany({
          where: {
            id: {
              in: ids
            },
            userId: sessionUser.role === Role.Admin ? undefined : sessionUser.id
          }
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
}
