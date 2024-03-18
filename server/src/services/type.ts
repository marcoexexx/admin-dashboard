import { AuditLog, OperationAction, Prisma, Resource, User } from "@prisma/client";
import { PartialShallow } from "lodash";
import { guestUserAccessResources, UserWithRole } from "../type";

import logging from "../middleware/logging/logging";
import AppError, { StatusCode } from "../utils/appError";
import { createAuditLog } from "../utils/auditLog";
import { convertPrismaErrorToAppError } from "../utils/convertPrismaErrorToAppError";
import Result, { as_result_async, Err, Ok } from "../utils/result";

export abstract class MetaAppService {
  constructor(
    public resource: Resource,
    public log: { action: OperationAction; resourceIds: string[]; } | undefined,
  ) {}

  async audit(
    user: User | undefined,
    _log?: PartialShallow<typeof this.log>,
  ): Promise<Result<AuditLog | undefined, AppError>> {
    const log = { ...this.log, ..._log };

    // if not user, not create auditlog
    if (!user) return Ok(undefined);

    if (!log) {
      return Err(
        AppError.new(StatusCode.ServiceUnavailable, `Could not create audit log for this resource: log is undefined`),
      );
    }
    if (!log.action) {
      return Err(
        AppError.new(StatusCode.ServiceUnavailable, `Could not create audit for this resource: action is undefined`),
      );
    }
    if (!Array.isArray(log.resourceIds) || !log.resourceIds.length) return Ok(undefined);

    const payload: Prisma.AuditLogUncheckedCreateInput = {
      userId: user.id,
      resource: this.resource,
      action: log.action,
      resourceIds: log.resourceIds,
    };

    const auditlog = await createAuditLog(payload);
    return auditlog;
  }

  /**
   * Check permissions
   * if Success return true and if access denied return Err
   */
  async checkPermissions(
    user: UserWithRole | undefined,
    action: OperationAction = OperationAction.Read,
  ): Promise<Result<boolean, AppError>> {
    if (!user) {
      const isAccess = guestUserAccessResources.some(perm => perm.resource === this.resource && perm.action === action);
      if (!isAccess) {
        return Err(AppError.new(StatusCode.Forbidden, `You do not have permission to access this resource.`));
      }
      return Ok(isAccess);
    }

    if (user.isSuperuser) return Ok(true);

    const isAccess = user.role?.permissions.some(perm => perm.resource === this.resource && perm.action === action);
    if (!isAccess) {
      return Err(AppError.new(StatusCode.Forbidden, `You do not have permission to access this resource.`));
    }

    // If does not role, return false
    return Ok(Boolean(isAccess));
  }
}

type AnyFn = (...args: any[]) => any;

type ServiceGeneric = {
  count: AnyFn;
  create: AnyFn;
  findMany: AnyFn;
  findUnique: AnyFn;
  findFirst: AnyFn;
  update: AnyFn;
  delete: AnyFn;
  deleteMany: AnyFn;
  upsert: AnyFn;
};

export abstract class AppService<
  T extends ServiceGeneric,
> extends MetaAppService {
  name: string = "AppService";

  constructor(
    public resource: Resource,
    public log: { action: OperationAction; resourceIds: string[]; } | undefined,
    public repository: T,
  ) {
    super(resource, log);
  }

  /**
   * Get totle of data
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryCount(...args: Parameters<typeof this.repository.count>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.count>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.count);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    this.log = {
      action: OperationAction.Read,
      resourceIds: [],
    };
    return result;
  }

  /**
   * Create a new
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryCreate(...args: Parameters<typeof this.repository.create>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.create>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.create);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    this.log = {
      action: OperationAction.Create,
      resourceIds: [(result.ok_or_throw() as { id: string; }).id],
    };
    return result;
  }

  /**
   * Finds all data based on the specified criteria.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryFindManyWithCount(
    ...args: [{ pagination: Pagination; }, ...Parameters<typeof this.repository.findMany>]
  ): Promise<
    Result<[number, Awaited<ReturnType<typeof this.repository.findMany>>], AppError>
  > {
    const [{ pagination }, arg] = args;
    const { page = 1, pageSize = 10 } = pagination;
    const offset = (page - 1) * pageSize;

    const opt = as_result_async(this.repository.findMany);
    const count = await this.tryCount({ where: arg?.where });
    if (count.is_err()) return Err(count.unwrap_err());

    const result = (await opt({ ...arg, skip: offset, take: pageSize })).map_err(convertPrismaErrorToAppError);
    if (result.is_err()) return Err(result.unwrap_err());

    this.log = {
      action: OperationAction.Read,
      resourceIds: (result.ok_or_throw() as { id: string; }[]).map(x => x.id),
    };
    return Ok([count.ok_or_throw(), result.ok_or_throw()]);
  }

  /**
   * Find unique one data by id.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryFindUnique(...args: Parameters<typeof this.repository.findUnique>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.findUnique>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.findUnique);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    const _res = result.ok();
    if (!_res) return Err(AppError.new(StatusCode.NotFound, `${this.resource} not found.`));

    if (_res) {
      this.log = {
        action: OperationAction.Read,
        resourceIds: [(_res as { id: string; }).id],
      };
    }
    return result;
  }

  /**
   * Find first data by specified criteria.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryFindFirst(...args: Parameters<typeof this.repository.findFirst>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.findFirst>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.findFirst);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    const _res = result.ok();
    if (!_res) return Err(AppError.new(StatusCode.NotFound, `${this.resource} not found.`));

    if (_res) {
      this.log = {
        action: OperationAction.Read,
        resourceIds: [(_res as { id: string; }).id],
      };
    }
    return result;
  }

  /**
   * Update data by filter and payload.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryUpdate(...args: Parameters<typeof this.repository.update>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.update>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.update);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    this.log = {
      action: OperationAction.Update,
      resourceIds: [(result.ok_or_throw() as { id: string; }).id],
    };
    return result;
  }

  /**
   * Delete data by id.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryDelete(...args: Parameters<typeof this.repository.delete>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.delete>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.delete);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    this.log = {
      action: OperationAction.Delete,
      resourceIds: [(result.ok_or_throw() as { id: string; }).id],
    };
    return result;
  }

  /**
   * Delete multi records data by id.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryDeleteMany(...args: Parameters<typeof this.repository.deleteMany>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.deleteMany>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.deleteMany);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    const _res = (arg?.where?.id as any)?.in;
    if (Array.isArray(_res) && _res.length) {
      this.log = {
        action: OperationAction.Delete,
        resourceIds: _res,
      };
    }
    return result;
  }

  async tryUpsert(...args: Parameters<typeof this.repository.upsert>): Promise<
    Result<Awaited<ReturnType<typeof this.repository.update>>, AppError>
  > {
    const [arg] = args;

    const opt = as_result_async(this.repository.upsert);
    const result = (await opt(arg)).map_err(convertPrismaErrorToAppError);

    this.log = {
      action: OperationAction.Update,
      resourceIds: [(result.ok_or_throw() as { id: string; }).id],
    };
    return result;
  }

  /**
   * Create multi data with excel upload
   *
   * @param file {Express.Multer.File} - The arguments for the create data.
   * @param uploadBy {User} - The arguments for the uploadBy user.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  async tryExcelUpload(file: Express.Multer.File, uploadBy?: User): Promise<Result<any, AppError>> {
    logging.debug(`Calling unimplemented service: ${this.name}.tryExcelUpload(${file}, ${uploadBy})`);
    return Err(AppError.new(StatusCode.ServiceUnavailable, `This feature is not implemented yet.`));
  }
}

export type Pagination = {
  page: number;
  pageSize: number;
};
