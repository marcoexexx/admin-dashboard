import { object, string, z } from "zod";


const params = {
  params: object({
    shopownerId: string({ required_error: "shopownerId is required" })
  })
}

export const createShopownerSchema = object({
  body: object({
    name: string({ required_error: "Name is required" })
      .min(1).max(128),
    remark: string({ required_error: "Remark is required" })
      .max(5000).optional()
  })
})

export const createMultiShopownersSchema = object({
  body: object({
    name: string({ required_error: "Name is required" })
      .min(1).max(128),
    remark: string({ required_error: "Remark is required" })
      .max(5000).optional()
  }).array()
})

export const getShopownerSchema = object({
  ...params,
})

export const updateShopownerSchema = object({
  ...params,
  body: object({
    name: string({ required_error: "Name is required" })
      .min(1).max(128),
    remark: string({ required_error: "Remark is required" })
      .max(5000).optional()
  })
})

export const deleteMultiShopownersSchema = object({
  body: object({
    shopownerIds: string().array()
  })
})


export type CreateShopownerInput = z.infer<typeof createShopownerSchema>["body"]
export type CreateMultiShopownersInput = z.infer<typeof createMultiShopownersSchema>["body"]
export type DeleteMultiShopownersInput = z.infer<typeof deleteMultiShopownersSchema>["body"]
export type GetShopownerInput = z.infer<typeof getShopownerSchema>
export type UpdateShopownerInput = z.infer<typeof updateShopownerSchema>

