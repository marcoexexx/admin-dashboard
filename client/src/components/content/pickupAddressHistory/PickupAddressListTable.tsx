import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,Typography } from "@mui/material"
import { LoadingTablePlaceholder } from "@/components";
import { PickupAddress } from "@/services/types";
import { RenderOrderLabel } from "@/components/table-labels";


const columnData: TableColumnHeader<PickupAddress>[] = [
  {
    id: "username",
    align: "left",
    name: "Username"
  },
  {
    id: "phone",
    align: "left",
    name: "Phone"
  },
  {
    id: "email",
    align: "left",
    name: "Email"
  },
  {
    id: "orders",
    align: "left",
    name: "Orders"
  },
]

const columnHeader = columnData.concat([])

interface PickupAddressListTableProps {
  pickupAddresses: PickupAddress[]
  isLoading?: boolean
  count: number
}

export function PickupAddressListTable(props: PickupAddressListTableProps) {
  const { pickupAddresses, count, isLoading } = props

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
            {pickupAddresses.map(row => {
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
                    {col.id === "username" && row.username}
                    {col.id === "phone" && row.phone}
                    {col.id === "email" && row.email}
                    {col.id === "orders" && row.orders?.map(order => <RenderOrderLabel key={order.id} order={order} />)}
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
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          page={0}
          rowsPerPage={count}
          rowsPerPageOptions={[count]}
        />
      </Box>
    </Card>
  )
}

