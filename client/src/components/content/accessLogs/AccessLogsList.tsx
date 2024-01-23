import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { AccessLogsListTable } from ".";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { getAccessLogsFn } from "@/services/accessLogsApi";


export function AccessLogsList() {
  const { state: {accessLogFilter} } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["access-logs", { filter: accessLogFilter }],
    queryFn: args => getAccessLogsFn(args, { 
      filter: accessLogFilter?.fields,
      pagination: {
        page: accessLogFilter?.page || 1,
        pageSize: accessLogFilter?.limit || 10
      },
    }),
    select: data => data
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />


  return <Card>
    <AccessLogsListTable
      isLoading={isLoading}
      accessLogs={data.results} 
      count={data.count} 
    />
  </Card>
}

