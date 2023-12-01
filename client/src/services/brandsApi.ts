import { CreateBrandInput, DeleteBrandInput, UpdateBrandInput } from "@/components/content/brands/forms";
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


export async function getBrandFn(opt: QueryOptionArgs, { brandId }: { brandId: string | undefined }) {
  if (!brandId) return
  const { data } = await authApi.get<BrandResponse>(`/brands/detail/${brandId}`, {
    ...opt,
  })
  return data
}


export async function createBrandFn(brand: CreateBrandInput) {
  const { data } = await authApi.post<IBrand>("/brands", brand)
  return data
}


export async function createMultiBrandsFn(brand: CreateBrandInput[]) {
  const { data } = await authApi.post<HttpResponse>("/brands/multi", brand)
  return data
}


export async function updateBrandFn({brandId, brand}: {brandId: string, brand: UpdateBrandInput}) {
  const { data } = await authApi.patch<HttpResponse>(`/brands/detail/${brandId}`, brand)
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
