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


export async function createMultiCategorisFn(categories: CreateCategoryInput[]) {
  const { data } = await authApi.post<HttpResponse>("/categories/multi", categories)
  return data
}


export async function updateCategoryFn({categoryId, category}: {categoryId: string, category: UpdateCategoryInput}) {
  const { data } = await authApi.patch<CategoryResponse>(`/categories/detail/${categoryId}`, category)
  return data
}


export async function deleteMultiCategoriesFn(categoryIds: DeleteCategoryInput["categoryId"][]) {
  await Promise.all(categoryIds.map(id => authApi.delete(`/categories/detail/${id}`)))
  return null
}


export async function deleteCategoryFn(categoryId: DeleteCategoryInput["categoryId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/categories/detail/${categoryId}`)
  return data
}
