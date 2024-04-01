import { CacheResource } from "@/context/cacheKey";
import AppError, { AppErrorKind } from "@/libs/exceptions";
import { HttpListResponse, Pagination, QueryOptionArgs } from "./types";

export abstract class BaseApiService<
  Where extends { fields?: any; include?: any; },
  Return,
> {
  public abstract repo: CacheResource;

  findMany(_opt: QueryOptionArgs, _where: {
    filter?: Where["fields"];
    pagination: Pagination;
    include?: Where["include"];
  }): Promise<HttpListResponse<Return>> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::findMany`,
      ),
    );
  }

  /**
   * @returns GenericResponse<Return, string>
   */
  find(
    _opt: QueryOptionArgs,
    _where: { filter: { id: string; }; include?: Where["include"]; },
  ): Promise<any> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::find`,
      ),
    );
  }

  uploadExcel(_buf: ArrayBuffer): Promise<any> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::uploadExcel`,
      ),
    );
  }

  /**
   * @returns GenericResponse<Return, string>
   */
  create(_payload: any): Promise<any> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::create`,
      ),
    );
  }

  update(_arg: { id: string; payload: any; }): Promise<any> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::update`,
      ),
    );
  }

  deleteMany(_ids: string[]): Promise<any> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::deleteMany`,
      ),
    );
  }

  /**
   * @returns GenericResponse<Return, string>
   */
  delete(_id: string): Promise<any> {
    return Promise.reject(
      AppError.new(
        AppErrorKind.ServiceUnavailable,
        `Unimplemented feature call ${this.repo}::delete`,
      ),
    );
  }
}
