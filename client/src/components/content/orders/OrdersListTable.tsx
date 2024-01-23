import { useState } from "react"
import { exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getOrderPermissionsFn } from "@/services/permissionsApi";
import { numberFormat } from "@/libs/numberFormat";
import { Box, Card, CardContent, Checkbox, Divider, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, Theme, useTheme, SelectChangeEvent } from "@mui/material"
import { MuiButton } from "@/components/ui";
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import { FormModal } from "@/components/forms";
import { Order, PotentialOrder } from "@/services/types";
import { PotentialOrdersActions } from ".";
import { RenderOrderItemLabel, RenderUsernameLabel } from "@/components/table-labels";
import { OrderStatus } from "./forms";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


const orderStatus: {
  label: OrderStatus,
  color: (theme: Theme) => string,
}[] = [
  {
    label: "Processing",
    color: (theme) => theme.colors.success.main,
  },
  {
    label: "Pending",
    color: (theme) => theme.colors.warning.main,
  }, 
  {
    label: "Cancelled",
    color: (theme) => theme.colors.error.main,
  },
  {
    label: "Shipped",
    color: (theme) => theme.colors.gradients.purple1,
  },
  {
    label: "Delivered",
    color: (theme) => theme.colors.primary.main,
  },
]

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
    id: "updatedAt",
    align: "left",
    name: "Orderrd date"
  },
  {
    id: "remark",
    align: "left",
    name: "Remark"
  },
]

const columnHeader = columnData.concat([
  {
    id: "status",
    align: "left",
    name: "Order status"
  },
  {
    id: "actions",
    align: "right",
    name: "Actions"
  },
])

interface OrdersListTableProps {
  orders: Order[]
  isLoading?: boolean
  count: number
  onStatusChange: (order: Order, status: OrderStatus) => void 
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
}

export function OrdersListTable(props: OrdersListTableProps) {
  const { orders, count, isLoading, onStatusChange, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {orderFilter, modalForm, user: me}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? orders.map(e => e.id)
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
      payload: "delete-order"
    })
  }

  const handleClickUpdateAction = (brandId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/orders/update/${brandId}`)
  }

  const handleOnExport = () => {
    exportToExcel(orders, "Orders")
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_ORDER_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_ORDER_FILTER",
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

  const handleChangeOrderStatus = (order: Order) => (evt: SelectChangeEvent) => {
    const { value } = evt.target
    onStatusChange(order, value as OrderStatus)
  }

  const isAllowedDeleteOrder = usePermission({
    key: "order-permissions",
    actions: "delete",
    queryFn: getOrderPermissionsFn
  })

  const isAllowedUpdateOrder = usePermission({
    key: "order-permissions",
    actions: "update",
    queryFn: getOrderPermissionsFn
  })

  const selectedAllRows = selectedRows.length === orders.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < orders.length


  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-order-multi"
          isAllowedDelete={isAllowedDeleteOrder}
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
                  : isAllowedUpdateOrder && isAllowedDeleteOrder
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map(row => {
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
                    {col.id === "updatedAt" && (new Date(row.updatedAt).toISOString())}
                    {col.id === "remark" && row.remark}
                  </Typography>
                </TableCell>)}

                <TableCell align="right">
                  <Select
                    labelId="order-status"
                    value={row.status}
                    onChange={handleChangeOrderStatus(row)}
                    size="small"
                  >
                    {orderStatus.map(status => {
                      return <MenuItem
                        key={status.label} 
                        value={status.label}
                      >
                        <Typography color={status.color(theme)}>{status.label}</Typography>
                      </MenuItem>
                    })}
                  </Select>
                </TableCell>


                {isAllowedUpdateOrder && isAllowedDeleteOrder
                ? <TableCell align="right">
                    {isAllowedUpdateOrder
                    ? <Tooltip title="Edit order" arrow>
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

                    {isAllowedDeleteOrder
                    ? <Tooltip title="Delete order" arrow>
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
          page={orderFilter?.page
            ? orderFilter.page - 1
            : 0}
          rowsPerPage={orderFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-order"
      ? <FormModal
        field="delete-order"
        title="Delete order"
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
