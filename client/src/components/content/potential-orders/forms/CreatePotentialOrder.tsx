import { PaymentMethodProvider, PotentialOrderStatus } from "@/services/types";
import { number, object, string, z } from "zod";
import { OrderAddressType } from "../../orders/forms";

const createPotentialOrderSchema = object({
  id: string().optional(),
  orderItems: string().array().default([]),
  status: z.nativeEnum(PotentialOrderStatus).default(PotentialOrderStatus.Processing),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  addressType: z.nativeEnum(OrderAddressType),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, {
    required_error: "paymentMethodProvider is required",
  }),
  remark: string().optional(),
});

export type CreatePotentialOrderInput = z.infer<typeof createPotentialOrderSchema>;

export interface CreatePotentialOrderProps {}

/**
 * Manual create potential order
 * not support yet
 */
export function CreatePotentialOrderForm(props: CreatePotentialOrderProps) {
  const {} = props;
  return "not support yet!";
}
