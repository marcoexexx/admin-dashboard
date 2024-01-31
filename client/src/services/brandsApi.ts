import { CreateBrandInput, UpdateBrandInput } from "@/components/content/brands/forms";
import { Brand, BrandResponse, HttpListResponse, HttpResponse, Pagination, QueryOptionArgs } from "./types";
import { authApi } from "./authApi";
import { BrandFilter } from "@/context/brand";


export async function getBrandsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: BrandFilter["fields"], pagination: Pagination, include?: BrandFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<Brand>>("/brands", {
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


export async function getBrandFn(opt: QueryOptionArgs, { brandId, include }: { brandId: string | undefined, include: BrandFilter["include"] }) {
  if (!brandId) return
  const { data } = await authApi.get<BrandResponse>(`/brands/detail/${brandId}`, {
    ...opt,
    params: { include }
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


export async function deleteMultiBrandsFn(brandIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/brands/multi", { data: { brandIds } })
  return data
}


export async function deleteBrandFn(brandId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/brands/detail/${brandId}`)
  return data
}
