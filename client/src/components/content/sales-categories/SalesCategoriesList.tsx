import { SuspenseLoader } from "@/components";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { useDeleteCategory } from "@/hooks/category";
import {
  useCreateMultiSalesCategories,
  useDeleteMultiSalesCategories,
  useGetSalesCategories,
} from "@/hooks/salsCategory";
import { Card } from "@mui/material";
import { SalesCategoriesListTable } from "./SalesCategoriesListTable";

export function SalesCategoriesList() {
  const { state: { salesCategoryFilter } } = useStore();

  // Queries
  const { try_data, isLoading } = useGetSalesCategories({
    filter: salesCategoryFilter.where,
    pagination: salesCategoryFilter.pagination || INITIAL_PAGINATION,
    include: {
      _count: true,
    },
  });

  // Mutations
  const { mutate: createSalesCategories } = useCreateMultiSalesCategories();
  const { mutate: deleteSalesCategory } = useDeleteCategory();
  const { mutate: deleteSalesCategories } = useDeleteMultiSalesCategories();

  // Extraction
  const sales = try_data.ok_or_throw();

  if (!sales || isLoading) return <SuspenseLoader />;

  function handleCreateManySalesCategories(buf: ArrayBuffer) {
    createSalesCategories(buf);
  }

  function handleDeleteBrand(id: string) {
    deleteSalesCategory(id);
  }

  function handleDeleteMultiSalesCategories(ids: string[]) {
    deleteSalesCategories(ids);
  }

  return (
    <Card>
      <SalesCategoriesListTable
        salesCategoiries={sales.results}
        count={sales.count}
        isLoading={isLoading}
        onCreateMany={handleCreateManySalesCategories}
        onDelete={handleDeleteBrand}
        onMultiDelete={handleDeleteMultiSalesCategories}
      />
    </Card>
  );
}
