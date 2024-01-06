import { authApi } from "./authApi";
import { HttpListResponse, HttpResponse, QueryOptionArgs, Region, RegionResponse } from "./types";


export async function getRegionsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: any, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<Region>>("/brands", {
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


export async function getRegionFn(opt: QueryOptionArgs, { regionId }: { regionId: string | undefined }) {
  if (!regionId) return
  const { data } = await authApi.get<RegionResponse>(`/regions/detail/${regionId}`, {
    ...opt,
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


export async function deleteMultiRegionsFn(regionIds: DeleteRegionInput["regionId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/regions/multi", { data: { regionIds } })
  return data
}


export async function deleteRegionFn(regionId: DeleteRegionInput["regionId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/regions/detail/${regionId}`)
  return data
}

