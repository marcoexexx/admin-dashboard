import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,Typography } from "@mui/material"
import { LoadingTablePlaceholder } from "@/components";

import { AccessLog } from "@/services/types";
import { useStore } from "@/hooks";


const columnData: TableColumnHeader<AccessLog>[] = [
  {
    id: "browser",
    align: "left",
    name: "Browser"
  },
  {
    id: "platform",
    align: "left",
    name: "Platform"
  },
  {
    id: "date",
    align: "left",
    name: "Date"
  },
]

const columnHeader = columnData.concat([
])

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
      <TableContainer>
        {isLoading
        ? <LoadingTablePlaceholder />
        : <Table>
          <TableHead>
            <TableRow>
              {columnHeader.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return header.id !== "actions"
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {accessLogs.map(row => {
              return <TableRow
                hover
                key={row.id}
              >
                {columnData.map(col => <TableCell align={col.align} key={col.id}>
                  <Typography
                    variant="body1"
                    fontWeight="normal"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {col.id === "browser" && row.browser}
                    {col.id === "platform" && row.platform}
                    {col.id === "date" && (new Date(row.date)).toString()}
                  </Typography>
                </TableCell>)}
              </TableRow>
            })}
          </TableBody>
        </Table>}
      </TableContainer>

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

