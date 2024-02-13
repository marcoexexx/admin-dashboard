import { number, object, string, z } from "zod";
import { orderAddressType, orderStatus } from "../../orders/forms";


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


const updateOrderSchema = object({
  // orderItems: object({
  //   price: number(),
  //   quantity: number(),
  //   productId: string(),
  //   totalPrice: number().min(0),
  //   saving: number()
  // }).array().min(0),
  status: z.enum(orderStatus).default("Pending"),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
  remark: string().optional(),
  addressType: z.enum(orderAddressType, { required_error: "Order address type is required" })
})

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

export interface UpdateOrderProps {}


/**
 * not support yet
 */
export function UpdateOrderForm(props: UpdateOrderProps) {
  const {} = props
  return "not support yet!"
}
