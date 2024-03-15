import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export function useCombineQuerys(...queries: (UseQueryResult | UseMutationResult<any, any, any, any>)[]) {
  const isError = queries.some(query => query.isError);
  const isLoading = queries.some(query => "isLoading" in query ? query.isLoading : query.isPending);
  const isSuccess = queries.every(query => query.isSuccess);

  return {
    error: isError ? queries.find(query => query.isError)?.error : null,
    isError,
    isLoading,
    isSuccess,
  };
}
