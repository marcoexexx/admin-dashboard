import { OrderItem } from "@/services/types"
import { Alert, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { RenderImageLabel, RenderProductLabel, RenderQuantityButtons } from "../table-labels"
import { CreateOrderInput } from "../content/orders/forms"
import { TypedColumn } from ".."
import { useLocalStorage } from "@/hooks"
import { numberFormat } from "@/libs/numberFormat"
import { number, object, string, z } from "zod"
import { calculateProductDiscount } from "../content/products/detail/ProductDetailTab"
import { useGetCart, useRemoveCartItem, useUpdateCartOrderItem } from "@/hooks/cart"


const createCartOrderItemSchema = object({
  price: number(),
  quantity: number(),
  productId: string(),
  totalPrice: number().min(0),
})
export type CreateCartOrderItemInput = z.infer<typeof createCartOrderItemSchema>

const updateCartOrderItemSchema = object({
  price: number(),
  quantity: number(),
  totalPrice: number().min(0),
})
export type UpdateCartOrderItemInput = z.infer<typeof updateCartOrderItemSchema>


const columns: TypedColumn<OrderItem & { discount: number, image: string }>[] = [
  {
    id: "image",
    align: "left",
    name: "Image",
    render: () => null
  },
  {
    id: "product",
    align: "left",
    name: "Product",
    render: () => null
  },
  {
    id: "quantity",
    align: "right",
    name: "Quantity",
    render: () => null
  },
  {
    id: "discount",
    align: "right",
    name: "Discount",
    render: () => null
  },
  {
    id: "price",
    align: "right",
    name: "Price",
    render: () => null
  },
  {
    id: "totalPrice",  // TODO: need manual
    align: "right",
    name: "Total price",
    render: () => null
  },
]


export function CartsTable() {
  const { get } = useLocalStorage()

  const { try_data } = useGetCart()
  const { mutate: removeItem } = useRemoveCartItem()
  const { mutate: updateCartOrderItem } = useUpdateCartOrderItem()

  const orderCarts = try_data.ok_or_throw()?.orderItems || []

  const totalAmount = orderCarts.reduce((total, item) => total + item.totalPrice, 0)
  const totalSaving = orderCarts.reduce((total, item) => total + item.saving, 0)
  const originalTotalPrice = orderCarts.reduce((total, item) => total + item.originalTotalPrice, 0)

  const isCreatedPotentialOrder = !!get<CreateOrderInput>("PICKUP_FORM")?.createdPotentialOrderId


  const handleOnIncrement = (item: OrderItem) => {
    if (!item.product || item.product.quantity <= item.quantity) return
    const quantity = (item.quantity + 1)
    const totalPrice = (quantity * calculateProductDiscount(item.product).productDiscountAmount || 0)

    updateCartOrderItem({
      id: item.id,
      payload: {
        ...item,
        price: item.product.price,
        quantity,
        totalPrice
      }
    })
  }

  const handleOnDecrement = (item: OrderItem) => {
    if (!item.product) return
    const quantity = (item.quantity - 1)
    const totalPrice = (quantity * calculateProductDiscount(item.product).productDiscountAmount || 0)

    updateCartOrderItem({
      id: item.id,
      payload: {
        ...item,
        price: item.product.price,
        quantity,
        totalPrice
      }
    })
  }

  const handleOnRemove = (item: OrderItem) => {
    removeItem(item.id)
  }


  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return render
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {orderCarts.map((row, idx) => {
              return <TableRow
                hover
                key={idx}
              >
                {columns.map(col => {
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
                        {col.id === "image" && <RenderImageLabel src={row.product?.images[0] || "/default.png"} alt={row.product?.title || "product"} />}
                        {col.id === "discount" && row.product && `${productDiscountPercent} %`}
                        {col.id === "product" && row.product && <RenderProductLabel product={row.product} />}
                        {col.id === "quantity" && <RenderQuantityButtons disabled={isCreatedPotentialOrder} item={row} onIncrement={handleOnIncrement} onDecrement={handleOnDecrement} onRemove={handleOnRemove} />}
                        {col.id === "price" && numberFormat(row.price)}
                        {col.id === "totalPrice" && numberFormat(row.originalTotalPrice)}
                      </Typography>
                    </TableCell>
                  )
                })}
              </TableRow>
            })}

            <TableRow>
              <TableCell align="right" colSpan={4} />
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
