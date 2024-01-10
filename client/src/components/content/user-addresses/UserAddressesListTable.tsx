import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import { FormModal } from "@/components/forms";
import { MuiButton } from "@/components/ui";
import { Address } from "@/services/types";
import { UserAddressActions } from ".";
import { useState } from "react"
import { exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getUserAddressPermissionsFn } from "@/services/permissionsApi";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';



const columnData: TableColumnHeader<Address>[] = [
  {
    id: "username",
    align: "left",
    name: "Name"
  },
  {
    id: "phone",
    align: "left",
    name: "Name"
  },
  {
    id: "email",
    align: "left",
    name: "Email"
  },
  {
    id: "fullAddress",
    align: "left",
    name: "Full address"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface UserAddressesListTableProps {
  userAddresses: Address[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
}

export function UserAddressesListTable(props: UserAddressesListTableProps) {
  const { userAddresses, count, isLoading, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {brandFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? userAddresses.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (brandId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(brandId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-brand"
    })
  }

  const handleClickUpdateAction = (brandId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/brands/update/${brandId}`)
  }

  const handleOnExport = () => {
    exportToExcel(userAddresses, "Addresses")
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_USER_ADDRESS_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_USER_ADDRESS_FILTER",
      payload: {
        limit: parseInt(evt.target.value, 10)
      }
    })
  }

  const handleCloseDeleteModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const isAllowedDeleteUserAddress = usePermission({
    key: "address-permissions",
    actions: "delete",
    queryFn: getUserAddressPermissionsFn
  })

  const isAllowedUpdateUserAddress = usePermission({
    key: "address-permissions",
    actions: "update",
    queryFn: getUserAddressPermissionsFn
  })

  const selectedAllRows = selectedRows.length === userAddresses.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < userAddresses.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-user-address-multi"
          isAllowedDelete={isAllowedDeleteUserAddress}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <UserAddressActions
          onExport={handleOnExport} 
        />
      </CardContent>

      <TableContainer>
        {isLoading
        ? <LoadingTablePlaceholder />
        : <Table>
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

              {columnHeader.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return header.id !== "actions"
                  ? render
                  : isAllowedUpdateUserAddress && isAllowedDeleteUserAddress
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {userAddresses.map(row => {
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

                {columnData.map(col => <TableCell align={col.align} key={col.id}>
                  <Typography
                    variant="body1"
                    fontWeight="normal"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {row.username}
                  </Typography>
                </TableCell>)}

                {isAllowedUpdateUserAddress && isAllowedDeleteUserAddress
                ? <TableCell align="right">
                    {isAllowedUpdateUserAddress
                    ? <Tooltip title="Edit Product" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={handleClickUpdateAction(row.id)}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}

                    {isAllowedDeleteUserAddress
                    ? <Tooltip title="Delete address" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          onClick={handleClickDeleteAction(row.id)}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}
                  </TableCell>
                : null}
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
          page={brandFilter?.page
            ? brandFilter.page - 1
            : 0}
          rowsPerPage={brandFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-user-address"
      ? <FormModal
        field="delete-user-address"
        title="Delete address"
        onClose={handleCloseDeleteModal}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography>Are you sure want to delete</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton variant="contained" color="error" onClick={() => onDelete(deleteId)}>Delete</MuiButton>
            <MuiButton variant="outlined" onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}>Cancel</MuiButton>
          </Box>
        </Box>
      </FormModal>
      : null}
    </Card>
  )
}
