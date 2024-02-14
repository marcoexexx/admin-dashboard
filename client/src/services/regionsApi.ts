import { CreateRegionInput } from "@/components/content/regions/forms/CreateRegionForm";
import { authApi } from "./authApi";
import { HttpListResponse, HttpResponse, Pagination, QueryOptionArgs, Region, RegionResponse } from "./types";
import { UpdateRegionInput } from "@/components/content/regions/forms/UpdateRegionForm";
import { RegionFilter } from "@/context/region";


export async function getRegionsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: RegionFilter["fields"], pagination: Pagination, include?: RegionFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<Region>>("/regions", {
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


export async function getRegionFn(opt: QueryOptionArgs, { regionId, include }: { regionId: string | undefined, include?: RegionFilter["include"] }) {
  if (!regionId) return
  const { data } = await authApi.get<RegionResponse>(`/regions/detail/${regionId}`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function createRegionFn(region: CreateRegionInput) {
  const { data } = await authApi.post<RegionResponse>("/regions", region)
  return data
}


export async function createMultiRegionsFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Brands_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/regions/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data

}


export async function updateRegionFn({regionId, region}: {regionId: string, region: UpdateRegionInput}) {
  const { data } = await authApi.patch<RegionResponse>(`/regions/detail/${regionId}`, region)
  return data
}


export async function deleteMultiRegionsFn(regionIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/regions/multi", { data: { regionIds } })
  return data
}


export async function deleteRegionFn(regionId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/regions/detail/${regionId}`)
  return data
}

