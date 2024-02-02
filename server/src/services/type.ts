import AppError from "../utils/appError"
import Result from "../utils/result"


export interface AppService {
  /**
   * Finds all data based on the specified criteria.
   *
   * @param arg - The arguments for the find operation.
   * @returns A promise that resolves to a Result containing either the data or an AppError.
   */
  find(arg: { filter?: any , pagination: Pagination, include?: any }): Promise<Result<any, AppError>>

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
