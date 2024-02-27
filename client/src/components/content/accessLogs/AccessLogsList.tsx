import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { AccessLogsListTable } from ".";
import { useStore } from "@/hooks";
import { useGetAccessLogs } from "@/hooks/accessLog";

import { INITIAL_PAGINATION } from "@/context/store";


export function AccessLogsList() {
  const { state: { accessLogFilter } } = useStore()

  // Queries
  const accessLogsQuery = useGetAccessLogs({
    filter: accessLogFilter.where,
    pagination: accessLogFilter.pagination || INITIAL_PAGINATION
  })

  // Extraction
  const data = accessLogsQuery.try_data.ok_or_throw()


  // TODO: Skeleton table loader
  if (!data || accessLogsQuery.isLoading) return <SuspenseLoader />


  return <Card>
    <AccessLogsListTable
      isLoading={accessLogsQuery.isLoading}
      accessLogs={data.results}
      count={data.count}
    />
  </Card>
}

