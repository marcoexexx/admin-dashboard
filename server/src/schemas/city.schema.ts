import { number, object, string, z } from "zod";
import { Pagination } from "./types";


export type CityFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
  },
  orderBy?: Record<
    keyof CreateCityInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    cityId: string({ required_error: "City Id is required" })
  })
}

export const createCitySchema = object({
  body: object({
    city: string({ required_error: "city name is required" }),
    fees: number({ required_error: "fees is required" }),
    regionId: string().optional()
  })
})

export const updateCitychema = object({
  params: object({
    cityId: string()
  }),
  body: object({
    city: string({ required_error: "city name is required" }),
    fees: number({ required_error: "fees is required" }),
    regionId: string().optional()
  })
})


export const createMultiCitiesSchema = object({
  body: object({
    city: string({ required_error: "city name is required" }),
    fees: number({ required_error: "fees is required" }),

    "region.name": string().optional()
  }).array()
})

export const getCitySchema = object({
  ...params
})

export const deleteMultiCitySchema = object({
  body: object({
    cityIds: string().array()
  })
})


export type GetCityInput = z.infer<typeof getCitySchema>
export type CreateCityInput = z.infer<typeof createCitySchema>["body"]
export type CreateMultiCitisInput = z.infer<typeof createMultiCitiesSchema>["body"]
export type DeleteMultiCitisInput = z.infer<typeof deleteMultiCitySchema>["body"]
export type UpdateCityInput = z.infer<typeof updateCitychema>


