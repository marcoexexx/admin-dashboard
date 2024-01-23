import { authApi } from "./authApi";
import { AuditLog, HttpListResponse, QueryOptionArgs } from "./types";


export async function getAuditLogsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: any, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<AuditLog>>("/audit-logs", {
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


export async function deleteAuditLogFn(auditLogId: string) {
  const { data } = await authApi.delete<HttpListResponse<AuditLog>>(`/audit-logs/detail/${auditLogId}`)
  return data
}

