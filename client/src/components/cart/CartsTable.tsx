import { OrderItem } from "@/services/types"
import { Alert, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { RenderProductLabel, RenderQuantityButtons } from "../table-labels"
import { CreateOrderInput } from "../content/orders/forms"
import { useLocalStorage } from "@/hooks"
import { useState } from "react"
import { numberFormat } from "@/libs/numberFormat"
import { calculateProductDiscount } from "../content/products/detail/ProductDetailTab"


const columnData: TableColumnHeader<OrderItem & { discount: number }>[] = [
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
    id: "discount",
    align: "right",
    name: "Discount"
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

  const totalAmount = orderCarts.reduce((total, item) => total + item.totalPrice, 0)
  const totalSaving = orderCarts.reduce((total, item) => total + item.saving, 0)
  const originalTotalPrice = orderCarts.reduce((total, item) => total + item.originalTotalPrice, 0)

  const { set, get } = useLocalStorage()

  const isCreatedPotentialOrder = !!get<CreateOrderInput>("PICKUP_FORM")?.createdPotentialOrderId


  const handleOnIncrement= (item: OrderItem) => {
    if (item.product && item.quantity < item.product?.quantity) {
      const payload = orderCarts
        .map(cart => {
          const { productDiscountAmount } = calculateProductDiscount(cart.product)

          const originalTotalPrice = (cart.quantity + 1) * cart.price
          const totalPrice = (cart.quantity + 1) * productDiscountAmount
          
          if (cart.id === item.id) return {
            ...cart,
            quantity: cart.quantity + 1,
            originalTotalPrice,
            totalPrice,
            saving: originalTotalPrice - totalPrice,
          }

          return cart
        })
        .filter(cart => 0 < cart.quantity)

      set("CARTS", payload)
      setOrderCarts(payload)
    }
  }

  const handleOnDecrement= (item: OrderItem) => {
    const payload = orderCarts
      .map(cart => {
        const { productDiscountAmount } = calculateProductDiscount(cart.product)

        const originalTotalPrice = (cart.quantity - 1) * cart.price
        const totalPrice = (cart.quantity - 1) * productDiscountAmount
        
        if (cart.id === item.id) return {
          ...cart,
          quantity: cart.quantity - 1,
          originalTotalPrice,
          totalPrice,
          saving: originalTotalPrice - totalPrice,
        }

        return cart
      })
      .filter(cart => 0 < cart.quantity)

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
                {columnData.map(col => {
                  const { productDiscountPercent } = calculateProductDiscount(row.product)

                  return (
                    <TableCell align={col.align} key={col.id}>
                      <Typography
                        variant="body1"
                        fontWeight="normal"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {col.id === "discount" && row.product && `${productDiscountPercent} %`}
                        {col.id === "product" && row.product && <RenderProductLabel product={row.product} />}
                        {col.id === "quantity" && <RenderQuantityButtons disabled={isCreatedPotentialOrder} item={row} onIncrement={handleOnIncrement} onDecrement={handleOnDecrement} />}
                        {col.id === "price" && numberFormat(row.price)}
                        {col.id === "totalPrice" && numberFormat(row.originalTotalPrice)}
                      </Typography>
                    </TableCell>
                  )
                })}
              </TableRow>
            })}

            <TableRow>
              <TableCell align="right" colSpan={3} />
              <TableCell align="right" sx={{ verticalAlign: "top" }}>
                <Typography variant="h4">Total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h4">{numberFormat(totalAmount)} Ks</Typography>
                <Typography variant="h5" sx={{ textDecoration: "line-through" }}>{numberFormat(originalTotalPrice)} Ks</Typography>
                <Box display="flex" alignItems="center" gap={1} justifyContent="end">
                  <Chip
                    label="saving" 
                    style={{ borderRadius: 5 }}
                    color="primary" 
                    size="small" />
                  <Typography variant="h5">{numberFormat(totalSaving)} Ks</Typography>
                </Box>
              </TableCell>
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
