import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { ExchangesListTable } from ".";
import { useStore } from "@/hooks";
import { useCreateMultiExchanges, useDeleteExchange, useDeleteMultiExchanges, useGetExchanges } from "@/hooks/exchange";


export function ExchangesList() {
  const { state: {exchangeFilter} } = useStore()

  // Queries
  const exchangesQuery = useGetExchanges({
    filter: exchangeFilter?.fields,
    pagination: {
      page: exchangeFilter?.page || 1,
      pageSize: exchangeFilter?.limit || 10
    },
  })

  // Mutations
  const createExchangesMutation = useCreateMultiExchanges()
  const deleteExchangeMutation = useDeleteExchange()
  const deleteExchangesMutation = useDeleteMultiExchanges()

  // Extraction
  const data = exchangesQuery.try_data.ok_or_throw()

  function handleCreateManyExchanges(buf: ArrayBuffer) {
    createExchangesMutation.mutate(buf)
  }

  function handleDeleteExchange(id: string) {
    deleteExchangeMutation.mutate(id)
  }

  function handleDeleteMultiExchanges(ids: string[]) {
    deleteExchangesMutation.mutate(ids)
  }


  // TODO: Sekelton table loader
  if (!data || exchangesQuery.isLoading) return <SuspenseLoader />

  return <Card>
    <ExchangesListTable
      exchanges={data.results} 
      count={data.count} 
      isLoading={exchangesQuery.isLoading}
      onCreateManyExchanges={handleCreateManyExchanges} 
      onDelete={handleDeleteExchange}
      onMultiDelete={handleDeleteMultiExchanges}
    />
  </Card>
}
