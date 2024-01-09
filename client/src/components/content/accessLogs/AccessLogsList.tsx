import { Card } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader } from "@/components";
import { getAccessLogsFn } from "@/services/accessLogsApi";
import { AccessLogsListTable } from ".";


export function AccessLogsList() {
  const { state: {accessLogFilter} } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["access-logs", { filter: accessLogFilter }],
    queryFn: getAccessLogsFn,
    select: data => data
  })


  if (isError && error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />


  return <Card>
    <AccessLogsListTable
      isLoading={isLoading}
      accessLogs={data.results} 
      count={data.count} 
    />
  </Card>
}

