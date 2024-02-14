import { SuspenseLoader } from "@/components";
import { SalesCategoriesListTable } from "./SalesCategoriesListTable";
import { Card } from "@mui/material";
import { useStore } from "@/hooks";
import { useCreateMultiSalesCategories, useDeleteMultiSalesCategories, useGetSalesCategories } from "@/hooks/salsCategory";
import { useDeleteCategory } from "@/hooks/category";


export function SalesCategoriesList() {
  const { state: {salesCategoryFilter} } = useStore()

  // Queries
  const { try_data, isLoading } = useGetSalesCategories({
    filter: salesCategoryFilter?.fields,
    pagination: {
      page: salesCategoryFilter?.page || 1,
      pageSize: salesCategoryFilter?.limit || 10,
    },
    include: {
      _count: true
    }
  })

  // Mutations
  const  { mutate: createSalesCategories } = useCreateMultiSalesCategories()
  const  { mutate: deleteSalesCategory } = useDeleteCategory()
  const  { mutate: deleteSalesCategories } = useDeleteMultiSalesCategories()

  // Extraction
  const sales = try_data.ok_or_throw()


  if (!sales || isLoading) return <SuspenseLoader />

  function handleCreateManySalesCategories(buf: ArrayBuffer) {
    createSalesCategories(buf)
  }

  function handleDeleteBrand(id: string) {
    deleteSalesCategory(id)
  }

  function handleDeleteMultiSalesCategories(ids: string[]) {
    deleteSalesCategories(ids)
  }

  return <Card>
    <SalesCategoriesListTable
      salesCategoiries={sales.results} 
      count={sales.count} 
      isLoading={isLoading}
      onCreateManySalesCategories={handleCreateManySalesCategories} 
      onDelete={handleDeleteBrand}
      onMultiDelete={handleDeleteMultiSalesCategories}
    />
  </Card>
}
