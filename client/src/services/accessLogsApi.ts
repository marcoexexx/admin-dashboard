import { AccessLog, GenericResponse, HttpListResponse, Pagination, QueryOptionArgs } from "./types";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";
import { AccessLogWhereInput } from "@/context/accessLog";
import { authApi } from "./authApi";


export class AccessLogApiService extends BaseApiService<AccessLogWhereInput, AccessLog> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new AccessLogApiService(CacheResource.AccessLog)
  }


  async findMany(opt: QueryOptionArgs, where: { filter: Record<keyof AccessLog, any> | undefined; pagination: Pagination; include?: { user?: boolean | undefined; } | undefined }): Promise<HttpListResponse<AccessLog>> {
    const url = `/${this.repo}`
    const { filter, pagination, include } = where

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
      },
    })
    return data
  }


  async delete(id: string): Promise<GenericResponse<AccessLog, "accessLog">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}
