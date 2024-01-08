import { boolean, number, object, string, z } from "zod";
import { Pagination } from "./types";


export type SalesCategoryFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
    products?: {
        product?: boolean
      include?: {
      }
    }
  },
  orderBy?: Record<
    keyof CreateSalesCategoryInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    salesCategoryId: string({ required_error: "Category Id is required" })
  })
}

export const createSalesCategorySchema = object({
  body: object({
    name: string({ required_error: "Category name is required" }),
    startDate: string({ required_error: "startDate is required" }),
    endDate: string({ required_error: "endDate is required" }),
    isActive: boolean().default(true),
    description: string().optional(),
  })
})

export const createProductSalesCategorySchema = object({
  params: object({
    productId: string()
  }),
  body: object({
    salesCategoryId: string(),
    discount: number().max(100).default(0)
  })
})


export const updateProductSaleCategorySchema = object({
  params: object({
    productSaleCategoryId: string()
  }),
  body: object({
    discount: number()
  })
})


export const createMultiSalesCategoriesSchema = object({
  body: object({
    name: string({ required_error: "Category name is required" }),
    startDate: string({ required_error: "startDate is required" }),
    endDate: string({ required_error: "endDate is required" }),
    isActive: boolean().default(true),
    description: string().optional(),
  }).array()
})

export const getSalesCategorySchema = object({
  ...params
})

export const updateSalesCategorySchema = object({
  ...params,
  body: object({
    name: string({ required_error: "Category name is required" }),
    startDate: string({ required_error: "startDate is required" }),
    endDate: string({ required_error: "endDate is required" }),
    isActive: boolean().default(true),
    description: string().optional(),
  })
})

export const deleteMultiSalesCategoriesSchema = object({
  body: object({
    salesCategoryIds: string().array()
  })
})


export type GetSalesCategoryInput = z.infer<typeof getSalesCategorySchema>
export type CreateSalesCategoryInput = z.infer<typeof createSalesCategorySchema>["body"]
export type CreateMultiSalesCategoriesInput = z.infer<typeof createMultiSalesCategoriesSchema>["body"]
export type CreateProductSalesCategoryInput = z.infer<typeof createProductSalesCategorySchema>
export type DeleteMultiSalesCategoriesInput = z.infer<typeof deleteMultiSalesCategoriesSchema>["body"]
export type UpdateSalesCategoryInput = z.infer<typeof updateSalesCategorySchema>
export type UpdateProductSaleCategoryInput = z.infer<typeof updateProductSaleCategorySchema>
