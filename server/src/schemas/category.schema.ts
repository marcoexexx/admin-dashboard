import { object, string, z } from "zod";

const params = {
  params: object({
    categoryId: string({ required_error: "Category Id is required" })
  })
}

export const createCategorySchema = object({
  body: object({
    name: string({ required_error: "Category name is required" })
  })
})

export const getCategorySchema = object({
  ...params
})


export type GetCategoryInput = z.infer<typeof getCategorySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"]
