import { OrderStatus, PaymentMethodProvider } from "@/services/types";
import { number, object, string, z } from "zod";

export const OrderAddressType = {
  Delivery: "Delivery",
  Pickup: "Pickup",
} as const;
export type OrderAddressType =
  typeof OrderAddressType[keyof typeof OrderAddressType];

export const createOrderSchema = object({
  orderItems: string().array(),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.Pending),
  deliveryAddressId: string().optional(),
  totalPrice: number().min(0),
  pickupAddressId: string().optional(),
  billingAddressId: string({
    required_error: "billingAddressId is required",
  }),
  paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, {
    required_error: "paymentMethodProvider is required",
  }),
  remark: string().optional(),

  createdPotentialOrderId: string().optional(),
  addressType: z.nativeEnum(OrderAddressType, {
    required_error: "Order address type is required",
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export interface CreateOrderProps {
}

export function CreateOrderForm(props: CreateOrderProps) {
  const {} = props;
  return <></>;
}
