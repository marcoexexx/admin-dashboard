import { Card } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader } from "@/components";
import { BrandsListTable } from "@/components/content/brands";
import { getBrandsFn } from "@/services/brandsApi";

export function BrandsList() {
  const { state } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["brands", { filter: state.brandFilter } ],
    queryFn: args => getBrandsFn(args, { 
      filter: state.brandFilter?.fields,
    }),
    select: data => data.results
  })

  if (!data && isError || error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  return <Card>
    <BrandsListTable brands={data} />
  </Card>
}
