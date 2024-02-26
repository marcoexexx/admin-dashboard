import { Box, Card, TablePagination, Typography, Theme, Select, MenuItem, useTheme, SelectChangeEvent, Divider } from "@mui/material"
import { EnhancedTable, TypedColumn } from "@/components";
import { Order, OrderStatus, Resource } from "@/services/types";
import { OrdersFilterForm } from ".";
import { RenderOrderItemLabel, RenderUsernameLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { numberFormat } from "@/libs/numberFormat";
import { useMemo } from "react";
import { INITIAL_PAGINATION } from "@/context/store";


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

const columns: TypedColumn<Order>[] = [
  {
    id: "user",
    align: "left",
    name: "Username",
    render: ({ value, me }) => value.user && me ? <RenderUsernameLabel user={value.user} me={me} /> : null
  },
  {
    id: "totalPrice",
    align: "left",
    name: "Amount",
    render: ({ value }) => <Typography>{numberFormat(value.totalPrice)}</Typography>
  },
  {
    id: "orderItems",
    align: "left",
    name: "Order No",
    render: ({ value }) => <>{value.orderItems?.map(item => <RenderOrderItemLabel key={item.id} orderItem={item} />)}</>
  },
  {
    id: "createdAt",
    align: "left",
    name: "Created",
    render: ({ value }) => <Typography>{new Date(value.createdAt).toUTCString()}</Typography>
  },
  {
    id: "updatedAt",
    align: "left",
    name: "Updated",
    render: ({ value }) => <Typography>{new Date(value.updatedAt).toUTCString()}</Typography>
  },
  {
    id: "remark",
    align: "left",
    name: "Remark",
    render: ({ value }) => <Typography>{value.remark}</Typography>
  },
]


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
  const { state: { orderFilter: { pagination } }, dispatch } = useStore()

  const theme = useTheme()

  const handleChangeOrderStatus = (order: Order) => (evt: SelectChangeEvent) => {
    const { value } = evt.target
    if (value) onStatusChange(order, value as OrderStatus)
  }

  const columnsWithEditableStatus = useMemo(() => columns.concat([
    {
      id: "status",
      align: "left",
      name: "Order status",
      render: ({ value }) => <Select
        labelId="order-status"
        value={value.status}
        onChange={handleChangeOrderStatus(value)}
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
    },
  ]), [])

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_ORDER_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_ORDER_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }


  return (
    <Card>
      <EnhancedTable<Order>
        refreshKey={[CacheResource.Order]}
        renderFilterForm={<OrdersFilterForm />}
        rows={orders}
        resource={Resource.Order}
        isLoading={isLoading}
        columns={columnsWithEditableStatus}
        onSingleDelete={onDelete}
        onMultiDelete={onMultiDelete}
      />

      <Divider />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={pagination?.page
            ? pagination.page - 1
            : 0}
          rowsPerPage={pagination?.pageSize || INITIAL_PAGINATION.pageSize}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}
