import { CreateExchangeInput, DeleteExchangeInput, UpdateExchangeInput } from "@/components/content/exchanges/forms";
import { authApi } from "./authApi";


export async function getExchangesFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<IExchange>>("/exchanges", {
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


export async function getExchangeFn(opt: QueryOptionArgs, { exchangeId }: { exchangeId: string | undefined }) {
  if (!exchangeId) return
  const { data } = await authApi.get<ExchangeResponse>(`/exchanges/detail/${exchangeId}`, {
    ...opt,
  })
  return data
}


export async function createExchangeFn(exchange: CreateExchangeInput) {
  const { data } = await authApi.post<ExchangeResponse>("/exchanges", exchange)
  return data
}


export async function updateExchangeFn({ exchangeId, exchange }: {exchangeId: string, exchange: UpdateExchangeInput}) {
  const { data } = await authApi.patch<ExchangeResponse>(`/exchanges/detail/${exchangeId}`, exchange)
  return data
}


export async function createMultiExchangesFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Categories_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/exchanges/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data
}


export async function deleteMultiExchangesFn(exchangeIds: DeleteExchangeInput["exchangeId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/exchanges/multi", { data: { exchangeIds } })
  return data
}


export async function deleteExchangeFn(exchangeId: DeleteExchangeInput["exchangeId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/exchanges/detail/${exchangeId}`)
  return data
}

