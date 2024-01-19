import { number, object, string, z } from "zod";
import { Pagination } from "./types";
import { paymentMethodProvider } from "./order.schema";


export const potentialOrderStatus = ["Processing", "Confimed", "Cancelled"] as const
const potentialOrderAddressType = ["Delivery", "Pickup"] as const


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

export const createPotentialOrderSchema = object({
  body: object({
    id: string().optional(),
    orderItems: object({
      price: number().min(0),
      quantity: number(),
      productId: string(),
      totalPrice: number().min(0),
      saving: number()
    }).array().min(0),
    status: z.enum(potentialOrderStatus).default("Processing"),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    addressType: z.enum(potentialOrderAddressType),
    pickupAddress: object({
      username: string({ required_error: "username is required" }),
      phone: string({ required_error: "phone number is required" }),
      email: string().optional(),
      date: string({ required_error: "date is required" }).default((new Date()).toISOString())
    }).optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    remark: string().optional()
  })
})

// WARN: Excel upload currently not support!

export const getPotentialOrderSchema = object({
  ...params
})

export const updatePotentialOrderSchema = object({
  ...params,
  body: object({
    id: string().optional(),
    orderItems: object({
      price: number(),
      quantity: number(),
      productId: string(),
      totalPrice: number().min(0),
      saving: number()
    }).array().min(0),
    status: z.enum(potentialOrderStatus).default("Processing"),
    addressType: z.enum(potentialOrderAddressType),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    pickupAddress: object({
      username: string({ required_error: "username is required" }),
      phone: string({ required_error: "phone number is required" }),
      email: string().optional(),
      date: string({ required_error: "date is required" }).default((new Date()).toISOString())
    }).optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.enum(paymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    remark: string().optional()
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
