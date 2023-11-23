import { CreateCategoryInput } from "@/components";
import { authApi } from "./authApi";

// TODO: fix filter type
export async function getSalesCategoriesFn(opt: QueryOptionArgs, { filter }: { filter: any }) {
  const { data } = await authApi.get<HttpListResponse<ISalesCategory>>("/sales-categories", {
    ...opt,
    params: {
      filter
    }
  })
  return data
}

export async function getSalesCategoryFn(categoryId: string) {
  const { data } = await authApi.get<SalesCategoryResponse>("/sales-categories/detail", {
    params: {
      categoryId
    }
  })
  return data
}

export async function createSalesCategoryFn(category: CreateCategoryInput) {
  const { data } = await authApi.post<SalesCategoryResponse>("/sales-categories", category)
  return data
}

