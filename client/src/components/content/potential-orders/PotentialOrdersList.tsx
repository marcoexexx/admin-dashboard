import { SuspenseLoader } from "@/components";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { useDeletePotentialOrder } from "@/hooks/potentialOrder";
import { useDeleteMultiPotentialOrders } from "@/hooks/potentialOrder/useDeleteMultiPotentialOrders";
import { useGetPotentialOrders } from "@/hooks/potentialOrder/useGetPotentialOrders";
import { Card } from "@mui/material";
import { PotentialOrdersListTable } from ".";

export function PotentialOrdersList() {
  const { state: { potentialOrderFilter } } = useStore();

  // Quries
  const { try_data, isError, isLoading, error } = useGetPotentialOrders({
    filter: potentialOrderFilter.where,
    pagination: potentialOrderFilter.pagination || INITIAL_PAGINATION,
    include: {
      user: true,
      orderItems: {
        include: {
          product: false,
        },
      },
    },
  });

  // Mutations
  const { mutate: deletePotentialOrder } = useDeletePotentialOrder();
  const { mutate: deletePotentialOrders } = useDeleteMultiPotentialOrders();

  // Extraction
  const potentialOrders = try_data.ok_or_throw();

  function handleDeletePotentialOrder(id: string) {
    deletePotentialOrder(id);
  }

  function handleDeleteMultiPotentialOrders(ids: string[]) {
    deletePotentialOrders(ids);
  }

  if (isError && error) return <h1>ERROR: {error.message}</h1>;

  if (!potentialOrders || isLoading) return <SuspenseLoader />;

  return (
    <Card>
      <PotentialOrdersListTable
        isLoading={isLoading}
        potentialOrders={potentialOrders.results}
        count={potentialOrders.count}
        onDelete={handleDeletePotentialOrder}
        onMultiDelete={handleDeleteMultiPotentialOrders}
      />
    </Card>
  );
}
