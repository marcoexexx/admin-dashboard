import { AuditLog, AuditLogAction, User } from "@prisma/client"
import { PartialShallow } from "lodash"
import AppError from "../utils/appError"
import Result from "../utils/result"


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


export interface Auditable {
  log?: { action: AuditLogAction; resourceIds: string[] }
  audit(user: User, config?: PartialShallow<Auditable["log"]>): Promise<Result<AuditLog | undefined, AppError>>
}


export type Pagination = {
  page: number,
  pageSize: number
}
