import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions } from "@/components";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { exportToExcel } from "@/libs/exportToExcel";
import { useStore } from "@/hooks";

import { useNavigate } from "react-router-dom";
import { UsersActions } from ".";


const columnData: TableColumnHeader<IUser>[] = [
  {
    id: "name",
    align: "left",
    name: "Name"
  },
  {
    id: "role",
    align: "left",
    name: "Role"
  }
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface UsersListTableProps {
  users: IUser[]
  count: number
  me: IUser
}

export function UsersListTable(props: UsersListTableProps) {
  const { users, count, me } = props

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {brandFilter}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? users.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickUpdateAction = (userId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/users/change-role/${userId}`)
  }

  const handleOnExport = () => {
    exportToExcel(users, "Users")
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_USER_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_USER_FILTER",
      payload: {
        limit: parseInt(evt.target.value, 10)
      }
    })
  }

  const selectedAllRows = selectedRows.length === users.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < users.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-brand-multi"
          onDelete={() => {}}
        />
      </Box>}

      <Divider />

      <CardContent>
        <UsersActions onExport={handleOnExport} />
      </CardContent>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllRows}
                  indeterminate={selectedSomeRows}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columnHeader.map(header => (
                <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(row => {
              const isSelected = selectedRows.includes(row.id)
              return <TableRow
                hover
                key={row.id}
                selected={isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected}
                    onChange={handleSelectOne(row.id)}
                    value={isSelected}
                  />
                </TableCell>

                {columnData.map(col => {
                  const key = col.id as keyof typeof row

                  return (
                    <TableCell align={col.align} key={col.id}>
                      <Typography
                        variant="body1"
                        fontWeight="normal"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {key === "name" && me.id === row.id
                        ? <a href={"/me/profile/"+row.id}>{row[key]}</a>
                        : row[key] as string}
                      </Typography>
                    </TableCell>
                  )
                })}

                <TableCell align="right">
                  <Tooltip title="Change Role" arrow>
                    <IconButton
                      sx={{
                        '&:hover': {
                          background: theme.colors.primary.lighter
                        },
                        color: theme.palette.primary.main
                      }}
                      onClick={handleClickUpdateAction(row.id)}
                      color="inherit"
                      size="small"
                    >
                      <AdminPanelSettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={brandFilter?.page
            ? brandFilter.page - 1
            : 0}
          rowsPerPage={brandFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}
