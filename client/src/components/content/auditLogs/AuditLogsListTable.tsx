import { useStore } from "@/hooks";
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,Typography } from "@mui/material"
import { LoadingTablePlaceholder } from "@/components";
import { AuditLog, Role } from "@/services/types";
import { RenderResourceItemLabel, RenderUsernameLabel } from "@/components/table-labels";


const columnData: TableColumnHeader<AuditLog & { role: Role }>[] = [
  {
    id: "user",
    align: "left",
    name: "User"
  },
  {
    id: "role",
    align: "left",
    name: "Role"
  },
  {
    id: "resource",
    align: "left",
    name: "Resource"
  },
  {
    id: "resourceIds",
    align: "left",
    name: "Resource items"
  },
  {
    id: "action",
    align: "left",
    name: "Action"
  },
]

const columnHeader = columnData.concat([])

interface AuditLogsListTableProps {
  auditLogs: AuditLog[]
  isLoading?: boolean
  count: number
}

export function AuditLogsListTable(props: AuditLogsListTableProps) {
  const { auditLogs, count, isLoading } = props

  const { state: {auditLogFilter, user: me}, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_AUDIT_LOG_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_AUDIT_LOG_FILTER",
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
            {auditLogs.map(row => {
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
                    {(col.id === "user" && row.user && me) && <RenderUsernameLabel user={row.user} me={me} />}
                    {(col.id === "role" && row.user && me) && row.user.role}
                    {col.id === "resource" && row.resource}
                    {col.id === "resourceIds" && row.resourceIds.map(id => <RenderResourceItemLabel key={id} id={id} resource={row.resource} />)}
                    {col.id === "action" && row.action}
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
          page={auditLogFilter?.page
            ? auditLogFilter.page - 1
            : 0}
          rowsPerPage={auditLogFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}

