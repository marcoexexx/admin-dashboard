import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { EnhancedTable, TypedColumn } from "@/components";
import { PickupAddress, Resource } from "@/services/types";
import { RenderOrderLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";


const columns: TypedColumn<PickupAddress>[] = [
  {
    id: "username",
    align: "left",
    name: "Username",
    render: ({ value }) => <Typography>{value.username}</Typography>
  },
  {
    id: "phone",
    align: "left",
    name: "Phone",
    render: ({ value }) => <Typography>{value.phone}</Typography>
  },
  {
    id: "email",
    align: "left",
    name: "Email",
    render: ({ value }) => <Typography>{value.email}</Typography>
  },
  {
    id: "orders",
    align: "left",
    name: "Orders",
    render: ({ value }) => <>{value.orders?.map(order => <RenderOrderLabel key={order.id} order={order} />)}</>
  },
]


interface PickupAddressListTableProps {
  pickupAddresses: PickupAddress[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
}

export function PickupAddressListTable(props: PickupAddressListTableProps) {
  const { pickupAddresses, count, isLoading, onDelete } = props

  return (
    <Card>
      <EnhancedTable
        hideTopActions
        hideCheckbox
        refreshKey={[CacheResource.PickupAddress]}
        rows={pickupAddresses}
        resource={Resource.PickupAddress}
        isLoading={isLoading}
        columns={columns}
        onSingleDelete={onDelete}
      />

      <Divider />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={() => { }}
          onRowsPerPageChange={() => { }}
          page={0}
          rowsPerPage={count}
          rowsPerPageOptions={[count]}
        />
      </Box>
    </Card>
  )
}

