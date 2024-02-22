import { PaymentMethodProvider, PotentialOrderStatus } from "@/services/types";
import { OrderAddressType } from "../../orders/forms";
import { number, object, string, z } from "zod";


const createPotentialOrderSchema = object({
  id: string().optional(),
  status: z.nativeEnum(PotentialOrderStatus).default(PotentialOrderStatus.Processing),
  orderItems: object({
    price: number().min(0),
    quantity: number(),
    productId: string(),
    totalPrice: number().min(0),
    saving: number()
  }).array(),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
  remark: string().optional(),
  addressType: z.nativeEnum(OrderAddressType, { required_error: "Order address type is required" })
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
