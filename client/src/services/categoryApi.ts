import { CreateCategoryInput, DeleteCategoryInput, UpdateCategoryInput } from "@/components/content/categories/forms";
import { authApi } from "./authApi";


export async function getCategoriesFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<ICategory>>("/categories", {
    ...opt,
    params: {
      filter,
      pagination
    },
  })
  return data
}


export async function getCategoryFn(opt: QueryOptionArgs, { categoryId }: { categoryId: string | undefined }) {
  if (!categoryId) return
  const { data } = await authApi.get<CategoryResponse>(`/categories/detail/${categoryId}`, {
    ...opt,
  })
  return data
}


export async function createCategoryFn(category: CreateCategoryInput) {
  const { data } = await authApi.post<CategoryResponse>("/categories", category)
  return data
}


export async function createMultiCategorisFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Categories_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/categories/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}


export async function updateCategoryFn({categoryId, category}: {categoryId: string, category: UpdateCategoryInput}) {
  const { data } = await authApi.patch<CategoryResponse>(`/categories/detail/${categoryId}`, category)
  return data
}


export async function deleteMultiCategoriesFn(categoryIds: DeleteCategoryInput["categoryId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/categories/multi", { data: { categoryIds } })
  return data
}


export async function deleteCategoryFn(categoryId: DeleteCategoryInput["categoryId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/categories/detail/${categoryId}`)
  return data
}
