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

export const createMultiCategoriesSchema = object({
  body: object({
    name: string({ required_error: "Category name is required" })
  }).array()
})

export const getCategorySchema = object({
  ...params
})

export const updateCategorySchema = object({
  ...params,
  body: object({
    name: string({ required_error: "Name is required" })
      .min(0).max(128)
  })
})

export const deleteMultiCategoriesSchema = object({
  body: object({
    categoryIds: string().array()
  })
})


export type GetCategoryInput = z.infer<typeof getCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"]
export type CreateMultiCategoriesInput = z.infer<typeof createMultiCategoriesSchema>["body"]
export type DeleteMultiCategoriesInput = z.infer<typeof deleteMultiCategoriesSchema>["body"]
