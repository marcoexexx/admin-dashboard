import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { getAuditLogsFn } from "@/services/auditLogsApi";
import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { AuditLogsListTable } from ".";


export function AuditLogsList() {
  const { state: {auditLogFilter} } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["audit-logs", { filter: auditLogFilter }],
    queryFn: args => getAuditLogsFn(args, { 
      filter: auditLogFilter?.fields,
      pagination: {
        page: auditLogFilter?.page || 1,
        pageSize: auditLogFilter?.limit || 10
      },
      include: {
        user: true
      }
    }),
    select: data => data
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />


  return <Card>
    <AuditLogsListTable
      isLoading={isLoading}
      auditLogs={data.results} 
      count={data.count} 
    />
  </Card>
}

