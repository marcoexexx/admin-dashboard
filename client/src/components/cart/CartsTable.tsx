import { OrderItem } from "@/services/types"
import { Alert, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { RenderQuantityButtons } from "../table-labels"
import { useLocalStorage } from "@/hooks"
import { useState } from "react"
import { CreateOrderInput } from "../content/orders/forms"
import { numberFormat } from "@/libs/numberFormat"


const columnData: TableColumnHeader<OrderItem>[] = [
  {
    id: "product",
    align: "left",
    name: "Product"
  },
  {
    id: "quantity",
    align: "right",
    name: "Quantity"
  },
  {
    id: "price",
    align: "right",
    name: "Price"
  },
  {
    id: "totalPrice",  // TODO: need manual
    align: "right",
    name: "Total price"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])


interface CartsTableProps {
  carts: OrderItem[]
}


export function CartsTable(props: CartsTableProps) {
  const { carts } = props

  const [orderCarts, setOrderCarts] = useState(carts)

  const totalPrice = orderCarts.reduce((total, item) => total + item.totalPrice, 0)

  const { set, get } = useLocalStorage()

  const isCreatedPotentialOrder = !!get<CreateOrderInput>("PICKUP_FORM")?.createdPotentialOrderId


  const handleOnIncrement= (id: string) => {
    const payload = orderCarts
      .map(cart => cart.id === id ? { ...cart, quantity: cart.quantity + 1, totalPrice: (cart.quantity + 1) * cart.price } : cart)
      .filter(cart => 0 <= cart.quantity)

    set("CARTS", payload)
    setOrderCarts(payload)
  }

  const handleOnDecrement= (id: string) => {
    const payload = orderCarts
      .map(cart => cart.id === id ? { ...cart, quantity: cart.quantity - 1, totalPrice: (cart.quantity - 1) * cart.price } : cart)
      .filter(cart => 0 <= cart.quantity)

    set("CARTS", payload)
    setOrderCarts(payload)
  }


  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TableContainer>
        <Table>
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
            {orderCarts.map((row, idx) => {
              return <TableRow
                hover
                key={idx}
              >
                {columnData.map(col => <TableCell align={col.align} key={col.id}>
                  <Typography
                    variant="body1"
                    fontWeight="normal"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {col.id === "product" && row.product && row.product.title}
                    {col.id === "quantity" && <RenderQuantityButtons disabled={isCreatedPotentialOrder} itemId={row.id} value={row.quantity} onIncrement={handleOnIncrement} onDecrement={handleOnDecrement} />}
                    {col.id === "price" && numberFormat(row.price)}
                    {col.id === "totalPrice" && numberFormat(row.totalPrice)}
                  </Typography>
                </TableCell>)}
              </TableRow>
            })}

            <TableRow>
              <TableCell align="right" colSpan={2} />
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">{numberFormat(totalPrice)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {isCreatedPotentialOrder
       ? <Alert severity="warning">Order items cannot be edited once potential order has been created.</Alert>
       : null}
    </Box>
  )
}
