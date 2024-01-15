import { number, object, string, z } from "zod";
import { Pagination } from "./types";
import { paymentMethodProvider } from "./order.schema";


export const potentialOrderStatus = ["Processing", "Confimed", "Cancelled"] as const


export type PotentialOrderFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
  },
  orderBy?: Record<
    keyof CreatePotentialOrderInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    potentialOrderId: string({ required_error: "Order Id is required" })
  })
}

const orderItem = object({
  price: number(),
  totalPrice: number(),
  quantity: number(),
  productId: string(),
})

export const createPotentialOrderSchema = object({
  body: object({
    orderItems: orderItem.array().min(1),
    status: z.enum(potentialOrderStatus).default("Processing"),
    remark: string().optional(),
    deliveryAddressId: string().optional(),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethod is required" })
  })
})

// WARN: Excel upload currently not support!

export const getPotentialOrderSchema = object({
  ...params
})

export const updatePotentialOrderSchema = object({
  ...params,
  body: object({
    orderItems: orderItem.array().min(1),
    remark: string().optional(),
    status: z.enum(potentialOrderStatus).default("Processing"),
    deliveryAddressId: string().optional(),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethod is required" })
  })
})

export const deleteMultiPotentialOrdersSchema = object({
  body: object({
    potentialOrderIds: string().array()
  })
})


export type GetPotentialOrderInput = z.infer<typeof getPotentialOrderSchema>
export type CreatePotentialOrderInput = z.infer<typeof createPotentialOrderSchema>["body"]
export type DeleteMultiPotentialOrdersInput = z.infer<typeof deleteMultiPotentialOrdersSchema>["body"]
export type UpdatePotentialOrderInput = z.infer<typeof updatePotentialOrderSchema>
