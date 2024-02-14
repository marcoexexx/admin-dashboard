import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { MuiButton } from "@/components/ui";
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import { FormModal } from "@/components/forms";
import { PotentialOrder } from "@/services/types";
import { PotentialOrdersActions } from ".";
import { RenderOrderItemLabel, RenderUsernameLabel } from "@/components/table-labels";
import { PermissionKey } from "@/context/cacheKey";
import { useState } from "react"
import { numberFormat } from "@/libs/numberFormat";
import { exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getPotentialOrderPermissionsFn } from "@/services/permissionsApi";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


const columnData: TableColumnHeader<PotentialOrder & { amount: number }>[] = [
  {
    id: "user",
    align: "left",
    name: "Username"
  },
  {
    id: "amount",
    align: "left",
    name: "Amount"
  },
  {
    id: "orderItems",
    align: "left",
    name: "Order No"
  },
  {
    id: "status",
    align: "left",
    name: "Order status"
  },
  {
    id: "createdAt",
    align: "left",
    name: "Created"
  },
  {
    id: "updatedAt",
    align: "left",
    name: "Updated"
  },
  {
    id: "remark",
    align: "left",
    name: "Remark"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  },
])

interface PotentialOrdersListTableProps {
  potentialOrders: PotentialOrder[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
}

export function PotentialOrdersListTable(props: PotentialOrdersListTableProps) {
  const { potentialOrders, count, isLoading, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {potentialOrderFilter, modalForm, user: me}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? potentialOrders.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (potentialOrderId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(potentialOrderId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-potential-order"
    })
  }

  const handleClickUpdateAction = (brandId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/potential-orders/update/${brandId}`)
  }

  const handleOnExport = () => {
    exportToExcel(potentialOrders, "Potential orders")
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_POTENTIAL_ORDER_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_POTENTIAL_ORDER_FILTER",
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

  const isAllowedDeletePotentialOrder = usePermission({
    key: PermissionKey.PotentialOrder,
    actions: "delete",
    queryFn: getPotentialOrderPermissionsFn
  })

  const isAllowedUpdatePotentialOrder = usePermission({
    key: PermissionKey.PotentialOrder,
    actions: "update",
    queryFn: getPotentialOrderPermissionsFn
  })

  const selectedAllRows = selectedRows.length === potentialOrders.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < potentialOrders.length


  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-potential-order-multi"
          isAllowedDelete={isAllowedDeletePotentialOrder}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <PotentialOrdersActions 
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
                  : isAllowedUpdatePotentialOrder && isAllowedDeletePotentialOrder
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {potentialOrders.map(row => {
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
                    {col.id === "user" && row.user && me && <RenderUsernameLabel user={row.user} me={me} />}
                    {col.id === "amount" && numberFormat(row.totalPrice)}
                    {col.id === "orderItems" && row.orderItems?.map(item => <RenderOrderItemLabel key={item.id} orderItem={item} />)}
                    {col.id === "status" && row.status}
                    {col.id === "updatedAt" && (new Date(row.updatedAt).toLocaleString())}
                    {col.id === "createdAt" && (new Date(row.createdAt).toLocaleString())}
                    {col.id === "remark" && row.remark}
                  </Typography>
                </TableCell>)}

                {isAllowedUpdatePotentialOrder && isAllowedDeletePotentialOrder
                ? <TableCell align="right">
                    {isAllowedUpdatePotentialOrder
                    ? <Tooltip title="Edit potential order" arrow>
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

                    {isAllowedDeletePotentialOrder
                    ? <Tooltip title="Delete potential order" arrow>
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
          page={potentialOrderFilter?.page
            ? potentialOrderFilter.page - 1
            : 0}
          rowsPerPage={potentialOrderFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-potential-order"
      ? <FormModal
        field="delete-potential-order"
        title="Delete potential order"
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
