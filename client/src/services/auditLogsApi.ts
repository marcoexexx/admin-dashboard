import { AuditLogWhereInput } from "@/context/auditLogs";
import { CacheResource } from "@/context/cacheKey";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import { AuditLog, GenericResponse, HttpListResponse, Pagination, QueryOptionArgs } from "./types";

export class AuditLogApiService extends BaseApiService<AuditLogWhereInput, AuditLog> {
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new AuditLogApiService(CacheResource.AuditLog);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: AuditLogWhereInput["where"];
      pagination: Pagination;
      include?: AuditLogWhereInput["include"];
    },
  ): Promise<HttpListResponse<AuditLog>> {
    const url = `/${this.repo}`;
    const { filter, pagination, include } = where;

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
        orderBy: {
          updatedAt: "desc",
        },
      },
    });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<AuditLog, "auditLog">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}

/**
 * DEBUG
 * const apiService = AuditLogApiService.new()
 *
 * apiService.delete("some_id")
 */
