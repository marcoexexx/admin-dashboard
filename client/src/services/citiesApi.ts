import { authApi } from "./authApi";
import { CityFees, CityResponse, HttpListResponse, HttpResponse, QueryOptionArgs } from "./types";
import { CreateCityInput, UpdateCityInput } from "@/components/content/cities/forms";


export async function getCitiesFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: any, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<CityFees>>("/cities", {
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


export async function getCityFn(opt: QueryOptionArgs, { cityId }: { cityId: string | undefined }) {
  if (!cityId) return
  const { data } = await authApi.get<CityResponse>(`/cities/detail/${cityId}`, {
    ...opt,
  })
  return data
}


export async function createCityFn(city: CreateCityInput) {
  const { data } = await authApi.post<CityResponse>("/cities", city)
  return data
}


export async function createMultiCitiesFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Cities_{Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/cities/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data

}


export async function updateCityFn({cityId, city}: {cityId: string, city: UpdateCityInput}) {
  const { data } = await authApi.patch<CityResponse>(`/cities/detail/${cityId}`, city)
  return data
}


export async function deleteMultiCitiesFn(cityIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/cities/multi", { data: { cityIds } })
  return data
}


export async function deleteCityFn(cityId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/cities/detail/${cityId}`)
  return data
}

