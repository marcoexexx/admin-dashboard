import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { useGetAuditLogs } from "@/hooks/auditLogs";
import { Card } from "@mui/material";
import { AuditLogsListTable } from ".";

export function AuditLogsList() {
  const { state: { auditLogFilter } } = useStore();

  // Quries
  const auditLogsQuery = useGetAuditLogs({
    filter: auditLogFilter.where,
    pagination: auditLogFilter.pagination || INITIAL_PAGINATION,
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  // Extraction
  const data = auditLogsQuery.try_data.ok_or_throw();

  return (
    <Card>
      <AuditLogsListTable
        isLoading={auditLogsQuery.isLoading}
        auditLogs={data?.results ?? []}
        count={data?.count ?? 0}
      />
    </Card>
  );
}
