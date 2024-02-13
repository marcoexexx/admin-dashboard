import { authApi } from "./authApi";
import { CreateSalesCategoryInput, DeleteSalesCategoryInput, UpdateSalesCategoryInput } from "@/components/content/sales-categories/forms";
import { HttpListResponse, HttpResponse, Pagination, QueryOptionArgs, SalesCategory, SalesCategoryResponse } from "./types";
import { SalesCategoryFilter } from "@/context/salesCategory";


export async function getSalesCategoriesFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: SalesCategoryFilter["fields"], pagination: Pagination, include?: SalesCategoryFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<SalesCategory>>("/sales-categories", {
    ...opt,
    params: {
      filter,
      pagination,
      orderBy: {
        updatedAt: "desc"
      },
      include
    },
  })
  return data
}


export async function getSalesCategoryFn(opt: QueryOptionArgs, { salesCategoryId, include }: { salesCategoryId: string | undefined, include?: SalesCategoryFilter["include"] }) {
  if (!salesCategoryId) return
  const { data } = await authApi.get<SalesCategoryResponse>(`/sales-categories/detail/${salesCategoryId}`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function createSalesCategoryFn(category: CreateSalesCategoryInput) {
  const { data } = await authApi.post<SalesCategoryResponse>("/sales-categories", category)
  return data
}


export async function createMultiSalesCategorisFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Products_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/sales-categories/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data
}


export async function updateSalesCategoryFn({salesCategoryId, salesCategory}: {salesCategoryId: string, salesCategory: UpdateSalesCategoryInput}) {
  const { data } = await authApi.patch<SalesCategoryResponse>(`/sales-categories/detail/${salesCategoryId}`, salesCategory)
  return data
}


export async function deleteMultiSalesCategoriesFn(categoryIds: DeleteSalesCategoryInput["salesCategoryId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/sales-categories/multi", { data: { salesCategoryIds: categoryIds } })
  return data
}


export async function deleteSalesCategoryFn(salesCategoryId: DeleteSalesCategoryInput["salesCategoryId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/sales-categories/detail/${salesCategoryId}`)
  return data
}
