import AppError, { AppErrorKind } from "@/libs/exceptions";
import { HttpListResponse, Pagination, QueryOptionArgs } from "./types";
import { CacheResource } from "@/context/cacheKey";


export abstract class BaseApiService<Where extends { fields?: any; include?: any }, Return> {
  public abstract repo: CacheResource

  findMany(_opt: QueryOptionArgs, _where: {
    filter?: Where["fields"],
    pagination: Pagination,
    include?: Where["include"],
  }): Promise<HttpListResponse<Return>> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }

  /**
  * @returns GenericResponse<Return, string>
  */
  find(_opt: QueryOptionArgs, _where: { filter: { id: string }; include?: Where["include"] }): Promise<any> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }

  uploadExcel(_buf: ArrayBuffer): Promise<any> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }

  /**
  * @returns GenericResponse<Return, string>
  */
  create(_payload: any): Promise<any> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }

  update(_arg: { id: string; payload: any }): Promise<any> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }

  deleteMany(_ids: string[]): Promise<any> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }

  /**
  * @returns GenericResponse<Return, string>
  */
  delete(_id: string): Promise<any> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Unimplemented feature`))
  }
}
