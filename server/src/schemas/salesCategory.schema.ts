import { object, string, z } from "zod";

const params = {
  params: object({
    salesCategoryId: string({ required_error: "Category Id is required" })
  })
}

export const createSalesCategorySchema = object({
  body: object({
    name: string({ required_error: "Category name is required" })
  })
})

export const getSalesCategorySchema = object({
  ...params
})


export type GetSalesCategoryInput = z.infer<typeof getSalesCategorySchema>
export type CreateSalesCategoryInput = z.infer<typeof createSalesCategorySchema>["body"]

