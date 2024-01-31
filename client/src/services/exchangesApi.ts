import { CreateExchangeInput, DeleteExchangeInput, UpdateExchangeInput } from "@/components/content/exchanges/forms";
import { Exchange, ExchangeResponse, HttpListResponse, HttpResponse, Pagination, QueryOptionArgs } from "./types";
import { authApi } from "./authApi";
import { ExchangeFilter } from "@/context/exchange";


export async function getExchangesFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: ExchangeFilter["fields"], pagination: Pagination, include?: ExchangeFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<Exchange>>("/exchanges", {
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


export async function getExchangeFn(opt: QueryOptionArgs, { exchangeId, include }: { exchangeId: string | undefined, include?: ExchangeFilter["include"] }) {
  if (!exchangeId) return
  const { data } = await authApi.get<ExchangeResponse>(`/exchanges/detail/${exchangeId}`, {
    ...opt,
    params: {
      include
    }
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

