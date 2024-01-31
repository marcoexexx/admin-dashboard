import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { AccessLogsListTable } from ".";
import { useStore } from "@/hooks";
import { useGetAccessLogs } from "@/hooks/accessLog";


export function AccessLogsList() {
  const { state: {accessLogFilter} } = useStore()

  // Queries
  const accessLogsQuery = useGetAccessLogs({
    filter: accessLogFilter?.fields,
    pagination: {
      page: accessLogFilter?.page || 1,
      pageSize: accessLogFilter?.limit || 10
    }
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

