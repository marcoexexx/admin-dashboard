import { Box, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";

import { useNavigate } from "react-router-dom";
import { UsersActions } from ".";
import { getUserPermissionsFn } from "@/services/permissionsApi";
import { LinkLabel } from "@/components";


function RenderUsernameLabel({user}: {user: IUser}) {
  const navigate = useNavigate()
  const to = "/profile/detail/" + user.username

  return <LinkLabel onClick={() => navigate(to)}>
    {user.name}
  </LinkLabel>
}


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

  const isAllowedUpdateUser = usePermission({
    key: "user-permissions",
    actions: "update",
    queryFn: getUserPermissionsFn
  })

  return (
    <Card>
      <CardContent>
        <UsersActions onExport={handleOnExport} />
      </CardContent>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Image</TableCell>

              {columnHeader.map(header => (
                <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(row => {
              return <TableRow
                hover
                key={row.id}
              >
                <TableCell align="left">
                  <img 
                    src={"/public/profile.png"}  // TODO: image upload
                    alt={row.username} 
                    height={60}
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
                        ? <RenderUsernameLabel user={row} />
                        : row[key] as string}
                      </Typography>
                    </TableCell>
                  )
                })}

                <TableCell align="right">
                  {isAllowedUpdateUser
                  ? <Tooltip title="Change Role" arrow>
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
                  : null}
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
