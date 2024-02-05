import bcrypt from 'bcryptjs'
import getConfig from '../../utils/getConfig';
import Email from '../../utils/email';
import Result, { Err, Ok, as_result_async } from "../../utils/result";
import AppError, { StatusCode } from "../../utils/appError";

import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { Prisma, Role, User } from "@prisma/client";
import { AppService, Pagination } from "../type";
import { db } from "../../utils/db";
import { generateRandomUsername } from "../../utils/generateRandomUsername";
import { createVerificationCode } from "../../utils/createVeriicationCode";
import { convertPrismaErrorToAppError } from '../../utils/convertPrismaErrorToAppError';


/**
 * UserService class provides methods for managing user data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to access logs.
 */
export class UserService implements AppService {
  private repository = db.user

  /**
   * Creates a new instance of UserService.
   * @returns A new instance of UserService.
   */
  static new() { return new UserService() }


  async create(payload: Prisma.UserCreateInput): Promise<Result<any, AppError>> {
    const tryCreate = as_result_async(this.repository.create)

    const try_data = (await tryCreate({ data: payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  // Create implements
  async register(payload: { name: string, email: string, password: string }): Promise<Result<User, AppError>> {
    const { name, email, password } = payload

    const hashedPassword = await bcrypt.hash(password, 12)

    let data = {
      name,
      email,
      username: generateRandomUsername(12),
      password: hashedPassword,
      role: Role.User as Role,
      verified: false,
      reward: {
        create: {
          points: 0,
        }
      },
      verificationCode: undefined as undefined | string
    }

    // set Admin if first time create user,
    const usersExistCount = await this.repository.count();
    if (usersExistCount === 0) {
      data.role = Role.Admin
    }

    // Email verification
    const { hashedVerificationCode, verificationCode } = createVerificationCode()
    data.verificationCode = hashedVerificationCode

    // Crete new user
    const user = (await this.create(data)).ok_or_throw()
    const redirectUrl = `${getConfig('origin')}/verify-email/${verificationCode}`

    try {
      await new Email(user, redirectUrl).sendVerificationCode()

      return Ok(user)
    } catch (err: any) {
      user.verificationCode = null

      return Err(AppError.new(err.status || StatusCode.InternalServerError, err?.message))
    }
  }


  // Find implements
  async find(arg: { filter?: Prisma.UserWhereInput; pagination: Pagination; include?: Prisma.UserInclude, orderBy?: Prisma.UserOrderByWithRelationInput }): Promise<Result<[number, User[]], AppError>> {
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


  // Find One implements
  async findUnique(id: string, include?: Prisma.UserInclude): Promise<Result<User | null, AppError>> {
    const tryUnique = as_result_async(this.repository.findUnique)

    const try_data = (await tryUnique({ where: { id }, include })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  // Find first implements
  async findFirst(payload: Prisma.UserWhereInput, include?: Prisma.UserInclude): Promise<Result<User | null, AppError>> {
    const tryFind = as_result_async(this.repository.findFirst)

    const try_data = (await tryFind({ where: payload, include })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  // Update implements
  async update(arg: { filter: Prisma.UserWhereUniqueInput; payload: Prisma.UserUpdateInput; }): Promise<Result<User, AppError>> {
    const { filter, payload } = arg
    const tryUpdate = as_result_async(this.repository.update)

    const try_data = (await tryUpdate({ where: filter, data: payload })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_data
  }


  // Delete implements
  async delete(id: string): Promise<Result<User, AppError>> {
    const tryDelete = as_result_async(this.repository.delete)

    const try_delete = (await tryDelete({ where: { id } })).map_err(err => {
      if (err instanceof PrismaClientKnownRequestError) return convertPrismaErrorToAppError(err)
      if (err instanceof PrismaClientValidationError) return AppError.new(StatusCode.BadRequest, `Invalid input. Please check your request parameters and try again`)
      return AppError.new(StatusCode.InternalServerError, err?.message)
    })

    return try_delete
  }
}

