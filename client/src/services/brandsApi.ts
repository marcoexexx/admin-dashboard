import { CreateBrandInput, DeleteBrandInput } from "@/components/content/brands/forms";
import { authApi } from "./authApi";


export async function getBrandsFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<IBrand>>("/brands", {
    ...opt,
    params: {
      filter,
      pagination
    },
  })
  return data
}


export async function createBrandFn(brand: CreateBrandInput) {
  const { data } = await authApi.post<IBrand>("/brands", brand)
  return data
}


export async function createMultiBrandsFn(brand: CreateBrandInput[]) {
  const { data } = await authApi.post<IBrand>("/brands/multi", brand)
  return data
}


export async function deleteMultiBrandsFn(brandIds: DeleteBrandInput["brandId"][]) {
  await Promise.all(brandIds.map(id => authApi.delete<HttpResponse>(`/brands/detail/${id}`)))
  return null
}


export async function deleteBrandFn(brandId: DeleteBrandInput["brandId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/brands/detail/${brandId}`)
  return data
}
