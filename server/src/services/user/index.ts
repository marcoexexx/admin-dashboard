import bcrypt from "bcryptjs";
import AppError, { StatusCode } from "../../utils/appError";
import Email from "../../utils/email";
import getConfig from "../../utils/getConfig";
import Result, { as_result_async, Err, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { guestUserAccessResources } from "../../type";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { createVerificationCode } from "../../utils/createVeriicationCode";
import { db } from "../../utils/db";
import { generateRandomUsername } from "../../utils/generateRandomUsername";
import { AppService } from "../type";

const repository = db.user;
/**
 * UserService class provides methods for managing user data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to user.
 */
export class UserService extends AppService<
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
    super(Resource.User, { action: OperationAction.Read, resourceIds: [] }, db.user);
  }

  /**
   * Creates a new instance of UserService.
   * @returns A new instance of UserService.
   */
  static new() {
    return new UserService();
  }

  async register(
    payload: { name: string; email: string; password: string; },
  ): Promise<Result<Awaited<ReturnType<typeof this.repository.create>>, AppError>> {
    const { name, email, password } = payload;

    const hashedPassword = await bcrypt.hash(password, 12);

    // set Superuser if first time create user,
    const isSuperuser = (await this.tryCount()).ok_or_throw() === 0 ? true : false;

    let data = {
      name,
      email,
      username: generateRandomUsername(12),
      password: hashedPassword,
      verified: false,
      isSuperuser,
      role: {
        connectOrCreate: {
          where: { name: "Customer" },
          create: {
            name: "Customer",
            remark: "Build-in role",
            permissions: {
              createMany: {
                data: [...guestUserAccessResources],
              },
            },
          },
        },
      },
      reward: {
        create: {
          points: 0,
        },
      },
      verificationCode: undefined as undefined | string,
    };

    // Email verification
    const { hashedVerificationCode, verificationCode } = createVerificationCode();
    data.verificationCode = hashedVerificationCode;

    // Crete new user
    const user = (await this.tryCreate({ data })).ok_or_throw();
    const redirectUrl = `${getConfig("origin")}/verify-email/${verificationCode}`;

    try {
      await new Email(user, redirectUrl).sendVerificationCode();

      return Ok(user);
    } catch (err: any) {
      user.verificationCode = null;

      return Err(AppError.new(err.status || StatusCode.InternalServerError, err?.message));
    }
  }

  // TODO: remove
  async tryInializeCart(
    ...args: Parameters<typeof db.cart.upsert>
  ): Promise<Result<Awaited<ReturnType<typeof db.cart.update>>, AppError>> {
    const [arg] = args;

    const opt = as_result_async(db.cart.upsert);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    return result;
  }

  async tryCleanCart(
    ...args: Parameters<typeof db.cart.delete>
  ): Promise<Result<Awaited<ReturnType<typeof db.cart.delete>>, AppError>> {
    const [arg] = args;

    const opt = as_result_async(db.cart.delete);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    return result;
  }

  async tryRemoveSingleOrderItem(
    ...args: Parameters<typeof db.orderItem.delete>
  ): Promise<Result<Awaited<ReturnType<typeof db.orderItem.delete>>, AppError>> {
    const [arg] = args;

    const opt = as_result_async(db.orderItem.delete);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    return result;
  }
}
