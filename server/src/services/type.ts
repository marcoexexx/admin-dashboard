import { AuditLog, OperationAction, Prisma, Resource, User } from "@prisma/client"
import { PartialShallow } from "lodash"
import { UserWithRole, guestUserAccessResources, shopownerAccessResources } from "../type";

import AppError, { StatusCode } from "../utils/appError"
import Result, { Err, Ok } from "../utils/result"


export class MetaAppService {
  constructor(
    public resource: Resource,
    public log: { action: OperationAction; resourceIds: string[] } | undefined
  ) {}


  async audit(user: User | undefined, _log?: PartialShallow<typeof this.log>): Promise<Result<AuditLog | undefined, AppError>> {
    const log = { ...this.log, ..._log }

    // if not user, not create auditlog
    if (!user) return Ok(undefined)

    if (!log) return Err(AppError.new(StatusCode.ServiceUnavailable, `Could not create audit log for this resource: log is undefined`))
    if (!log.action) return Err(AppError.new(StatusCode.ServiceUnavailable, `Could not create audit for this resource: action is undefined`)) 
    if (!Array.isArray(log.resourceIds) || !log.resourceIds.length) return Ok(undefined)

    const payload: Prisma.AuditLogUncheckedCreateInput = {
      userId: user.id,
      resource: this.resource,
      action: log.action,
      resourceIds: log.resourceIds
    }

    // const auditlog = (await createAuditLog(payload))
    //   .or_else(err => err.status === StatusCode.NotModified ? Ok(undefined) : Err(err))
    const auditlog = Ok(undefined)
    console.log({ payload })

    return Ok(auditlog.ok_or_throw())
  }


  /**
   * Check permissions
   * if Success return true and if access denied return Err
   */
  async checkPermissions(user: UserWithRole | undefined, action: OperationAction = OperationAction.Read): Promise<Result<boolean, AppError>> {
    if (!user) {
      const isAccess = guestUserAccessResources.some(perm => perm.resource === this.resource && perm.action === action)
      if (!isAccess) return Err(AppError.new(StatusCode.Forbidden, `You do not have permission to access this resource.`))
      return Ok(isAccess)
    }

    if (user.isSuperuser) return Ok(true)

    const isAccess = user.role?.permissions.some(perm => perm.resource === this.resource && perm.action === action)
    console.log({ isAccess, perms: user.role?.permissions.map(p => `${p.action}::${p.resource}`) })
    if (!isAccess) return Err(AppError.new(StatusCode.Forbidden, `You do not have permission to access this resource.`))

    // If does not role, return false
    return Ok(Boolean(isAccess))
  }
}


export interface AppService {
  /**
   * Get totle of data
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryCount(): Promise<Result<number, AppError>>
  /**
   * Create a new
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryCreate(args: any): Promise<Result<any, AppError>>

  /**
   * Create multi data with excel upload
   *
   * @param file {Express.Multer.File} - The arguments for the create data.
   * @param uploadBy {User} - The arguments for the uploadBy user.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryExcelUpload(file: Express.Multer.File, uploadBy?: User): Promise<Result<any, AppError>>

  /**
   * Finds all data based on the specified criteria.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryFindManyWithCount(args: any): Promise<Result<any, AppError>>

  /**
   * Find unique one data by id.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryFindUnique(args: any): Promise<Result<any, AppError>>

  /**
   * Find first data by specified criteria.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryFindFirst(args: any): Promise<Result<any, AppError>>

  /**
   * Update data by filter and payload.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryUpdate(args: any): Promise<Result<any, AppError>>

  /**
   * Delete data by id.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryDelete(args: any): Promise<Result<any, AppError>>

  /**
   * Delete multi records data by id.
   *
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  tryDeleteMany(args: any): Promise<Result<any, AppError>>
}


export type Pagination = {
  page: number,
  pageSize: number
}
