import { number, object, string, z } from "zod";


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

const potentialOrderItem = object({
  price: number(),
  totalPrice: number(),
  quantity: number(),
  productId: string(),
})


const createPotentialOrderSchema = object({
  orderItems: potentialOrderItem.array().min(1),
  status: z.enum(potentialOrderStatus).default("Processing"),
  deliveryAddressId: string().optional(),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethod is required" }),
  remark: string().optional()
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
