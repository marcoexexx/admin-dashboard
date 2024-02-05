import AppError from "../utils/appError"
import Result from "../utils/result"


export interface AppService {
  /**
   * Create a new
   *
   * @param payload - The arguments for the create data.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  create(payload: any): Promise<Result<any, AppError>>

  /**
   * Finds all data based on the specified criteria.
   *
   * @param arg - The arguments for the find operation.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  find(arg: { filter?: any , pagination: Pagination, include?: any }): Promise<Result<any, AppError>>

  /**
   * Find unique one data by id.
   *
   * @param id - The arguments for the find operation.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  findUnique(id: string, include?: any): Promise<Result<any, AppError>>

  /**
   * Find first data by specified criteria.
   *
   * @param payload - The arguments for the find data.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  findFirst(payload: any, include?: any): Promise<Result<any, AppError>>

  /**
   * Update data by filter and payload.
   *
   * @param arg - The arguments for the find and update data operation.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  update(arg: { filter: any, payload: any }): Promise<Result<any, AppError>>

  /**
   * Delete data by id.
   *
   * @param id - The arguments for the find operation.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  delete(id: string): Promise<Result<any, AppError>>
}


export type Pagination = {
  page: number,
  pageSize: number
}
