import { AuditLog, GenericResponse, HttpListResponse, Pagination, QueryOptionArgs } from "./types";
import { BaseApiService } from "./baseApiService";
import { AuditLogWhereInput } from "@/context/auditLogs";
import { CacheResource } from "@/context/cacheKey";
import { authApi } from "./authApi";


export class AuditLogApiService extends BaseApiService<AuditLogWhereInput, AuditLog> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new AuditLogApiService(CacheResource.AuditLog)
  }

  async findMany(opt: QueryOptionArgs, where: { filter: Record<keyof AuditLog, any> | undefined; pagination: Pagination; include?: { user?: boolean | undefined; } | undefined; orderBy?: Record<keyof AuditLog, any> | undefined; }): Promise<HttpListResponse<AuditLog>> {
    const url = `/${this.repo}`
    const { filter, pagination, include } = where

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
        orderBy: {
          updatedAt: "desc"
        },
      },
    })
    return data
  }


  async delete(id: string): Promise<GenericResponse<AuditLog, "auditLog">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}


/**
 * DEBUG
 * const apiService = AuditLogApiService.new()
 *
 * apiService.delete("some_id")
 */
