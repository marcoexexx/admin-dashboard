import { SuspenseLoader } from "@/components";
import { ShopownersListTable } from "@/components/content/shopowners";
import { Card } from "@mui/material";

import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import {
  useCreateMultiShopowners,
  useDeleteMultiShopowners,
  useDeleteShopowner,
  useGetShopowners,
} from "@/hooks/shopowner";

export function ShopownersList() {
  const { state: { shopownerFilter } } = useStore();

  // Queries
  const shopownersQuery = useGetShopowners({
    filter: shopownerFilter.where,
    pagination: shopownerFilter.pagination || INITIAL_PAGINATION,
  });

  // Mutations
  const createShopownersMutation = useCreateMultiShopowners();
  const deleteShopownerMutation = useDeleteShopowner();
  const deleteShopownersMutation = useDeleteMultiShopowners();

  // Extraction
  const data = shopownersQuery.try_data.ok_or_throw();

  function handleCreateManyShopowners(buf: ArrayBuffer) {
    createShopownersMutation.mutate(buf);
  }

  function handleDeleteShopowner(id: string) {
    deleteShopownerMutation.mutate(id);
  }

  function handleDeleteMultiShopowners(ids: string[]) {
    deleteShopownersMutation.mutate(ids);
  }

  if (!data || shopownersQuery.isLoading) return <SuspenseLoader />;

  return (
    <Card>
      <ShopownersListTable
        isLoading={shopownersQuery.isLoading}
        shopowners={data.results}
        count={data.count}
        onCreateMany={handleCreateManyShopowners}
        onDelete={handleDeleteShopowner}
        onMultiDelete={handleDeleteMultiShopowners}
      />
    </Card>
  );
}
