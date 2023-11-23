import { Card } from "@mui/material";
import { ProductsListTable } from ".";
import { useQuery } from "@tanstack/react-query";
import { getProductsFn } from "@/services/productsApi";
import { useStore } from "@/hooks";

export function ProductsList() {
  const { state } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["products", { filter: state.productFilter } ],
    queryFn: args => getProductsFn(args, { filter: state.productFilter }),
    select: data => data.results
  })

  if (!data || isError || error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <h1>Loading...</h1>

  return <Card>
    <ProductsListTable products={data} />
  </Card>
}
