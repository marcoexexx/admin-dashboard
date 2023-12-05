import { CreateSalesCategoryInput, DeleteSalesCategoryInput, UpdateSalesCategoryInput } from "@/components/content/sales-categories/forms";
import { authApi } from "./authApi";


export async function getSalesCategoriesFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<ISalesCategory>>("/sales-categories", {
    ...opt,
    params: {
      filter,
      pagination
    },
  })
  return data
}


export async function getSalesCategoryFn(opt: QueryOptionArgs, { salesCategoryId }: { salesCategoryId: string | undefined }) {
  if (!salesCategoryId) return
  const { data } = await authApi.get<SalesCategoryResponse>(`/sales-categories/detail/${salesCategoryId}`, {
    ...opt,
  })
  return data
}


export async function createSalesCategoryFn(category: CreateSalesCategoryInput) {
  const { data } = await authApi.post<SalesCategoryResponse>("/sales-categories", category)
  return data
}


export async function createMultiSalesCategorisFn(categories: CreateSalesCategoryInput[]) {
  const { data } = await authApi.post<HttpResponse>("/sales-categories/multi", categories)
  return data
}


export async function updateSalesCategoryFn({salesCategoryId, salesCategory}: {salesCategoryId: string, salesCategory: UpdateSalesCategoryInput}) {
  const { data } = await authApi.patch<SalesCategoryResponse>(`/sales-categories/detail/${salesCategoryId}`, salesCategory)
  return data
}


export async function deleteMultiSalesCategoriesFn(categoryIds: DeleteSalesCategoryInput["salesCategoryId"][]) {
  await Promise.all(categoryIds.map(id => authApi.delete(`/sales-categories/detail/${id}`)))
  return null
}


export async function deleteSalesCategoryFn(salesCategoryId: DeleteSalesCategoryInput["salesCategoryId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/sales-categories/detail/${salesCategoryId}`)
  return data
}
