import { number, object, string, z } from "zod";


export const orderStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const
export type OrderStatus = typeof orderStatus[number]

const orderItem = object({
  price: number(),
  totalPrice: number(),
  quantity: number(),
  productId: string(),
})


const createOrderSchema = object({
  orderItems: orderItem.array()
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export interface CreateOrderProps {
}

export function CreateOrder(props: CreateOrderProps) {
  const {} = props
  return <></>
}
