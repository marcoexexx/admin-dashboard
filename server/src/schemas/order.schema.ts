import { AddressType, OrderStatus, PaymentMethodProvider } from "@prisma/client";
import { number, object, string, z } from "zod";


const params = {
  params: object({
    orderId: string({ required_error: "Order Id is required" })
  })
}


export const createOrderSchema = object({
  body: object({
    orderItems: string().array().default([]),
    status: z.nativeEnum(OrderStatus).default(OrderStatus.Pending),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    addressType: z.nativeEnum(AddressType),
    remark: string().optional()
  })
})


// WARN: Excel upload currently not support!


export const getOrderSchema = object({
  ...params
})


// INFO: Could not update their order items, when created
export const updateOrderSchema = object({
  ...params,
  body: object({
    status: z.nativeEnum(OrderStatus).default(OrderStatus.Pending),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    addressType: z.nativeEnum(AddressType),
    remark: string().optional()
  })
})


export const deleteMultiOrdersSchema = object({
  body: object({
    orderIds: string().array()
  })
})


export type GetOrderInput = z.infer<typeof getOrderSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"]
export type DeleteMultiOrdersInput = z.infer<typeof deleteMultiOrdersSchema>["body"]
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

