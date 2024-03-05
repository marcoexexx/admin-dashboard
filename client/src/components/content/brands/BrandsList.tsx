import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { BrandsListTable } from "@/components/content/brands";

import { useStore } from "@/hooks";
import { useCreateMultiBrands, useDeleteBrand, useDeleteMultiBrands, useGetBrands } from "@/hooks/brand";
import { INITIAL_PAGINATION } from "@/context/store";


export function BrandsList() {
  const { state: { brandFilter } } = useStore()

  // Queries
  const brandsQuery = useGetBrands({
    filter: brandFilter.where,
    pagination: brandFilter.pagination || INITIAL_PAGINATION,
  })

  // Mutations
  const createBrandsMutation = useCreateMultiBrands()
  const deleteBrandMutation = useDeleteBrand()
  const deleteBrandsMutation = useDeleteMultiBrands()

  // Extraction
  const data = brandsQuery.try_data.ok_or_throw()

  function handleCreateManyBrands(buf: ArrayBuffer) {
    createBrandsMutation.mutate(buf)
  }

  function handleDeleteBrand(id: string) {
    deleteBrandMutation.mutate(id)
  }

  function handleDeleteMultiBrands(ids: string[]) {
    deleteBrandsMutation.mutate(ids)
  }


  if (!data || brandsQuery.isLoading) return <SuspenseLoader />


  return <Card>
    <BrandsListTable
      isLoading={brandsQuery.isLoading}
      brands={data.results}
      count={data.count}
      onCreateMany={handleCreateManyBrands}
      onDelete={handleDeleteBrand}
      onMultiDelete={handleDeleteMultiBrands}
    />
  </Card>
}
