import { CategoriesListTable } from "@/components/content/categories";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import {
  useCreateMultiCategories,
  useDeleteCategory,
  useDeleteMultiCategories,
  useGetCategories,
} from "@/hooks/category";
import { Card } from "@mui/material";

export function CategoriesList() {
  const { state: { categoryFilter } } = useStore();

  // Queries
  const categoriesQuery = useGetCategories({
    filter: categoryFilter.where,
    pagination: categoryFilter.pagination || INITIAL_PAGINATION,
  });

  // Mutations
  const createCategoriesMutation = useCreateMultiCategories();
  const deleteCategoryMutation = useDeleteCategory();
  const deleteCategoriesMutation = useDeleteMultiCategories();

  // Extraction
  const data = categoriesQuery.try_data.ok_or_throw();

  function handleCreateManyCategories(buf: ArrayBuffer) {
    createCategoriesMutation.mutate(buf);
  }

  function handleDeleteCategory(id: string) {
    deleteCategoryMutation.mutate(id);
  }

  function handleDeleteMultiCategories(ids: string[]) {
    deleteCategoriesMutation.mutate(ids);
  }

  return (
    <Card>
      <CategoriesListTable
        categories={data?.results ?? []}
        count={data?.count ?? 0}
        isLoading={categoriesQuery.isLoading}
        onCreateMany={handleCreateManyCategories}
        onDelete={handleDeleteCategory}
        onMultiDelete={handleDeleteMultiCategories}
      />
    </Card>
  );
}
