import { number, object, string, z } from "zod";


export const orderAddressType = ["Delivery", "Pickup"] as const
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
    price: number().min(0),
    quantity: number(),
    productId: string(),
    totalPrice: number().min(0),
    saving: number()
  }).array(),
  status: z.enum(orderStatus).default("Pending"),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  pickupAddress: object({
    username: string({ required_error: "username is required" }),
    phone: string({ required_error: "phone number is required" }),
    email: string().optional(),
    date: z.any()
  }).optional(),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
  remark: string().optional(),

  createdPotentialOrderId: string().optional(),
  addressType: z.enum(orderAddressType, { required_error: "Order address type is required" })
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export interface CreateOrderProps {
}

export function CreateOrderForm(props: CreateOrderProps) {
  const {} = props
  return <></>
}
