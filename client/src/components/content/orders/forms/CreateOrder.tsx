import { number, object, string, z } from "zod";


export const orderAddressType = ["delivery", "pickup"] as const
export type OrderAddressType = typeof orderAddressType[number]

export const orderStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const
export type OrderStatus = typeof orderStatus[number]

export const paymentMethodProvider = [
  "Cash",
  "AYAPay",
  "CBPay",
  "KBZPay",
  "OnePay",
  "UABPay",
  "WavePay",
  "BankTransfer",
] as const
export type PaymentMethodProvider = typeof paymentMethodProvider[number]


export const createOrderSchema = object({
  orderItems: object({
    price: number(),
    totalPrice: number(),
    quantity: number(),
    productId: string(),
  }).array(),
  status: z.enum(orderStatus).default("Pending"),
  deliveryAddressId: string().optional(),
  pickupAddress: object({
    username: string({ required_error: "username is required" }),
    phone: string({ required_error: "phone number is required" }),
    email: string().optional(),
    date: z.any()
  }).optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
  remark: string().optional(),

  addressType: z.enum(orderAddressType, { required_error: "Order address type is required" })
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export interface CreateOrderProps {
}

export function CreateOrder(props: CreateOrderProps) {
  const {} = props
  return <></>
}
