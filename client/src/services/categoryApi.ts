import { CreateCategoryInput } from "@/components";
import { authApi } from "./authApi";

// TODO: fix filter type
export async function getCategoriesFn(opt: QueryOptionArgs, { filter }: { filter: any }) {
  const { data } = await authApi.get<HttpListResponse<ICategory>>("/categories", {
    ...opt,
    params: {
      filter
    }
  })
  return data
}

export async function getCategoryFn(categoryId: string) {
  const { data } = await authApi.get<CategoryResponse>("/categories/detail", {
    params: {
      categoryId
    }
  })
  return data
}

export async function createCategoryFn(category: CreateCategoryInput) {
  const { data } = await authApi.post<CategoryResponse>("/categories", category)
  return data
}
