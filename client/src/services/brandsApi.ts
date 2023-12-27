import { CreateBrandInput, DeleteBrandInput, UpdateBrandInput } from "@/components/content/brands/forms";
import { authApi } from "./authApi";


export async function getBrandsFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<IBrand>>("/brands", {
    ...opt,
    params: {
      filter,
      pagination,
      orderBy: {
        updatedAt: "desc"
      }
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
  const { data } = await authApi.post<BrandResponse>("/brands", brand)
  return data
}


export async function createMultiBrandsFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Brands_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/brands/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data

}


export async function updateBrandFn({brandId, brand}: {brandId: string, brand: UpdateBrandInput}) {
  const { data } = await authApi.patch<BrandResponse>(`/brands/detail/${brandId}`, brand)
  return data
}


export async function deleteMultiBrandsFn(brandIds: DeleteBrandInput["brandId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/brands/multi", { data: { brandIds } })
  return data
}


export async function deleteBrandFn(brandId: DeleteBrandInput["brandId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/brands/detail/${brandId}`)
  return data
}
