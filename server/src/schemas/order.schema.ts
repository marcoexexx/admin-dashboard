import { number, object, string, z } from "zod";
import { Pagination } from "./types";


export const paymentMethodProvider = [
  "Cash",
  "AYAPay",
  "CBPay",
  "KBZPay",
  "OnePay",
  "UABPay",
  "WavePay",
  "BankTransfer",
] as const

export const orderStatus = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const

const orderAddressType = [
  "Delivery", 
  "Pickup"
] as const


export type OrderFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
  },
  orderBy?: Record<
    keyof CreateOrderInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    orderId: string({ required_error: "Order Id is required" })
  })
}


export const createOrderSchema = object({
  body: object({
    orderItems: object({
      price: number(),
      quantity: number(),
      productId: string(),
      originalTotalPrice: number().min(0),
      saving: number()
    }).array().min(0),
    status: z.enum(orderStatus).default("Pending"),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    addressType: z.enum(orderAddressType),
    remark: string().optional()
  })
})


// WARN: Excel upload currently not support!


export const getOrderSchema = object({
  ...params
})


export const updateOrderSchema = object({
  ...params,
  body: object({
    orderItems: object({
      price: number(),
      quantity: number(),
      productId: string(),
      originalTotalPrice: number().min(0),
      saving: number()
    }).array().min(0),
    status: z.enum(orderStatus).default("Pending"),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    addressType: z.enum(orderAddressType),
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
// export type CreateMultiOrdersInput = z.infer<typeof createMultiOrdersSchema>["body"]
export type DeleteMultiOrdersInput = z.infer<typeof deleteMultiOrdersSchema>["body"]
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

