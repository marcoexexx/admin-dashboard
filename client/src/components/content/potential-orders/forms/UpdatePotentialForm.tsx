import { number, object, string, z } from "zod";
import { potentialOrderStatus } from ".";


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


const updatePotentialOrderSchema = object({
  orderItems: potentialOrderItem.array().min(1),
  status: z.enum(potentialOrderStatus).default("Processing"),
  deliveryAddressId: string().optional(),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethod is required" })
})

export type UpdatePotentialOrderInput = z.infer<typeof updatePotentialOrderSchema>

export interface UpdatePotentialOrderProps {}


/**
 * not support yet
 */
export function UpdatePotentialOrderForm(props: UpdatePotentialOrderProps) {
  const {} = props
  return "not support yet!"
}
