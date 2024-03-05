import { number, object, string, z } from "zod";


const params = {
  params: object({
    cartId: string({ required_error: "cartId is required" })
  })
}

export const createCartOrderItemSchema = object({
  body: object({
    price: number(),
    quantity: number(),
    productId: string(),
    totalPrice: number().min(0),
  })
})

export const updateCartOrderItemSchema = object({
  params: object({
    orderItemId: string({ required_error: "orderItemId is required."})
  }),
  body: object({
    price: number(),
    quantity: number(),
    totalPrice: number().min(0),
  })
})

export const getCartSchema = object({
  ...params,
})

export const deleteCartOrderItemSchema = object({
  params: object({
    orderItemId: string({ required_error: "orderItemId is required."})
  })
})


export type CreateCartOrderItemInput = z.infer<typeof createCartOrderItemSchema>["body"]
export type UpdateCartOrderItemInput = z.infer<typeof updateCartOrderItemSchema>
export type GetCartInput = z.infer<typeof getCartSchema>
export type DeleteCartOrderItemInput = z.infer<typeof deleteCartOrderItemSchema>["params"]
