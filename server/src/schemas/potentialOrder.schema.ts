import { AddressType, PaymentMethodProvider, PotentialOrderStatus } from "@prisma/client";
import { number, object, string, z } from "zod";


const params = {
  params: object({
    potentialOrderId: string({ required_error: "Order Id is required" })
  })
}

export const createPotentialOrderSchema = object({
  body: object({
    id: string().optional(),
    orderItems: string().array().default([]),
    status: z.nativeEnum(PotentialOrderStatus).default(PotentialOrderStatus.Processing),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    addressType: z.nativeEnum(AddressType),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
    remark: string().optional()
  })
})

// WARN: Excel upload currently not support!

export const getPotentialOrderSchema = object({
  ...params
})

// INFO: Could not update their order items, when created
export const updatePotentialOrderSchema = object({
  ...params,
  body: object({
    id: string().optional(),
    status: z.nativeEnum(PotentialOrderStatus).default(PotentialOrderStatus.Processing),
    addressType: z.nativeEnum(AddressType),
    deliveryAddressId: string().optional(),
    totalPrice: number().min(0),
    pickupAddressId: string().optional(),
    billingAddressId: string({ required_error: "billingAddressId is required" }),
    paymentMethodProvider: z.nativeEnum(PaymentMethodProvider, { required_error: "paymentMethodProvider is required" }),
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
