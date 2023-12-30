import { boolean, number, object, string, z } from "zod";
import { Pagination } from "./types";
import { CreateBrandInput } from "./brand.schema";


export type SalesCategoryFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
    products?: {
      include?: {
        product?: boolean
      }
    }
  },
  orderBy?: Record<
    keyof CreateBrandInput | "createdAt" | "updatedAt", 
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
export type DeleteMultiSalesCategoriesInput = z.infer<typeof deleteMultiSalesCategoriesSchema>["body"]
export type UpdateSalesCategoryInput = z.infer<typeof updateSalesCategorySchema>
