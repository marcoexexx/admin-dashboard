import { PaymentMethodProvider, PotentialOrderStatus } from "@/services/types";
import { OrderAddressType } from "../../orders/forms";
import { number, object, string, z } from "zod";


const updatePotentialOrderSchema = object({
  id: string().optional(),
  status: z.nativeEnum(PotentialOrderStatus).default(PotentialOrderStatus.Processing),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  pickupAddress: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
  remark: string().optional(),
  addressType: z.nativeEnum(OrderAddressType, { required_error: "Order address type is required" })
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
