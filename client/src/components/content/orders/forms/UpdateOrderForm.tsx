import { OrderStatus, PaymentMethodProvider } from "@/services/types";
import { number, object, string, z } from "zod";
import { OrderAddressType } from ".";

const updateOrderSchema = object({
  // orderItems: object({
  //   price: number(),
  //   quantity: number(),
  //   productId: string(),
  //   totalPrice: number().min(0),
  //   saving: number()
  // }).array().min(0),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.Pending),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  pickupAddressId: string().optional(),
  billingAddressId: string({ required_error: "billingAddressId is required" }),
  paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
  remark: string().optional(),
  addressType: z.nativeEnum(OrderAddressType, { required_error: "Order address type is required" }),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

export interface UpdateOrderProps {}

/**
 * not support yet
 */
export function UpdateOrderForm(props: UpdateOrderProps) {
  const {} = props;
  return "not support yet!";
}
