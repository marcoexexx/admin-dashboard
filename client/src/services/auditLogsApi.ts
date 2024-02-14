import { AuditLogFilter } from "@/context/auditLogs";
import { authApi } from "./authApi";
import { AuditLog, HttpListResponse, Pagination, QueryOptionArgs } from "./types";


export async function getAuditLogsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: AuditLogFilter["fields"], pagination: Pagination, include?: AuditLogFilter["include"] }) {
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

