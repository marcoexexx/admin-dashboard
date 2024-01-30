import { authApi } from "./authApi";
import { AccessLog, HttpListResponse, Pagination, QueryOptionArgs } from "./types";


export async function getAccessLogsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: Pagination, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<AccessLog>>("/access-logs", {
    ...opt,
    params: {
      filter,
      pagination,
      orderBy: {
        updatedAt: "desc"
      },
      include
    },
  })
  return data
}


export async function deleteAccessLogFn(accessLogId: string) {
  const { data } = await authApi.delete<HttpListResponse<AccessLog>>(`/access-logs/detail/${accessLogId}`)
  return data
}

