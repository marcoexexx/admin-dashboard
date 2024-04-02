import { AccessLogWhereInput } from "@/context/accessLog";
import { CacheResource } from "@/context/cacheKey";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import {
  AccessLog,
  GenericResponse,
  HttpListResponse,
  Pagination,
  QueryOptionArgs,
} from "./types";

export class AccessLogApiService
  extends BaseApiService<AccessLogWhereInput, AccessLog>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new AccessLogApiService(CacheResource.AccessLog);
  }

  override async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: AccessLogWhereInput["where"];
      pagination: Pagination;
      include?: AccessLogWhereInput["include"];
    },
  ): Promise<HttpListResponse<AccessLog>> {
    const url = `/${this.repo}`;
    const { filter, pagination, include } = where;

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
      },
    });
    return data;
  }

  override async delete(
    id: string,
  ): Promise<GenericResponse<AccessLog, "accessLog">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
