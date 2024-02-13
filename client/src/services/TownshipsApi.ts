import { CreateTownshipInput, UpdateTownshipInput } from "@/components/content/townships/forms";
import { authApi } from "./authApi";
import { HttpListResponse, HttpResponse, Pagination, QueryOptionArgs, TownshipFees, TownshipResponse } from "./types";
import { TownshipFilter } from "@/context/township";


export async function getTownshipsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: TownshipFilter["fields"], pagination: Pagination, include?: TownshipFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<TownshipFees>>("/townships", {
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


export async function getTownshipFn(opt: QueryOptionArgs, { townshipId, include }: { townshipId?: string, include?: TownshipFilter["include"] }) {
  if (!townshipId) return
  const { data } = await authApi.get<TownshipResponse>(`/townships/detail/${townshipId}`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function createTownshipFn(city: CreateTownshipInput) {
  const { data } = await authApi.post<TownshipResponse>("/townships", city)
  return data
}


export async function createMultiTownshipsFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Cities_{Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/townships/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data

}


export async function updateTownshipFn({townshipId, township}: {townshipId: string, township: UpdateTownshipInput}) {
  const { data } = await authApi.patch<TownshipResponse>(`/townships/detail/${townshipId}`, township)
  return data
}


export async function deleteMultiTownshipsFn(townshipIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/townships/multi", { data: { townshipIds } })
  return data
}


export async function deleteTownshipFn(townshipId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/townships/detail/${townshipId}`)
  return data
}

