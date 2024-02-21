import { Box, Card, TablePagination, Typography } from "@mui/material"
import { EnhancedTable, TypedColumn } from "@/components";
import { AccessLog, Resource } from "@/services/types";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";


const columns: TypedColumn<AccessLog>[] = [
  {
    id: "browser",
    align: "left",
    name: "Browser",
    render: ({value}) => <Typography>{value.browser}</Typography>
  },
  {
    id: "platform",
    align: "left",
    name: "Platform",
    render: ({value}) => <Typography>{value.platform}</Typography>
  },
  {
    id: "date",
    align: "left",
    name: "Date",
    render: ({value}) => <Typography>{new Date(value.date).toUTCString()}</Typography>
  },
]

interface AccessLogsListTableProps {
  accessLogs: AccessLog[]
  isLoading?: boolean
  count: number
}

export function AccessLogsListTable(props: AccessLogsListTableProps) {
  const { accessLogs, count, isLoading } = props
  const { state: {accessLogFilter}, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_ACCESS_LOG_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_ACCESS_LOG_FILTER",
      payload: {
        limit: parseInt(evt.target.value, 10)
      }
    })
  }


  return (
    <Card>
      <EnhancedTable
        hideCheckbox
        hideTopActions
        refreshKey={[CacheResource.AccessLog]}
        rows={accessLogs}
        resource={Resource.AccessLog}
        isLoading={isLoading}
        columns={columns}
      />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={accessLogFilter?.page
            ? accessLogFilter.page - 1
            : 0}
          rowsPerPage={accessLogFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}

