import { number, object, string, z } from "zod";
import { orderAddressType } from "../../orders/forms";


export const potentialOrderStatus = ["Processing", "Confimed", "Cancelled"] as const
export type PotentialOrderStatus = typeof potentialOrderStatus[number]

const paymentMethodProvider = [
  "Cash",
  "AYAPay",
  "CBPay",
  "KBZPay",
  "OnePay",
  "UABPay",
  "WavePay",
  "BankTransfer",
] as const


const createPotentialOrderSchema = object({
  id: string().optional(),
  status: z.enum(potentialOrderStatus).default("Processing"),
  orderItems: object({
    price: number(),
    totalPrice: number(),
    quantity: number(),
    productId: string(),
  }).array(),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
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

export type CreatePotentialOrderInput = z.infer<typeof createPotentialOrderSchema>

export interface CreatePotentialOrderProps {}


/**
 * Manual create potential order
 * not support yet
 */
export function CreatePotentialOrderForm(props: CreatePotentialOrderProps) {
  const {} = props
  return "not support yet!"
}
