import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import {
  useCreateMultiExchanges,
  useDeleteExchange,
  useDeleteMultiExchanges,
  useGetExchanges,
} from "@/hooks/exchange";
import { Card } from "@mui/material";
import { ExchangesListTable } from ".";

export function ExchangesList() {
  const { state: { exchangeFilter } } = useStore();

  // Queries
  const exchangesQuery = useGetExchanges({
    filter: exchangeFilter.where,
    pagination: exchangeFilter.pagination || INITIAL_PAGINATION,
    include: {
      shopowner: true,
    },
  });

  // Mutations
  const createExchangesMutation = useCreateMultiExchanges();
  const deleteExchangeMutation = useDeleteExchange();
  const deleteExchangesMutation = useDeleteMultiExchanges();

  // Extraction
  const data = exchangesQuery.try_data.ok_or_throw();

  function handleCreateManyExchanges(buf: ArrayBuffer) {
    createExchangesMutation.mutate(buf);
  }

  function handleDeleteExchange(id: string) {
    deleteExchangeMutation.mutate(id);
  }

  function handleDeleteMultiExchanges(ids: string[]) {
    deleteExchangesMutation.mutate(ids);
  }

  return (
    <Card>
      <ExchangesListTable
        exchanges={data?.results ?? []}
        count={data?.count ?? 0}
        isLoading={exchangesQuery.isLoading}
        onCreateMany={handleCreateManyExchanges}
        onDelete={handleDeleteExchange}
        onMultiDelete={handleDeleteMultiExchanges}
      />
    </Card>
  );
}
