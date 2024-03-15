import { SuspenseLoader } from "@/components";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { useDeleteMultiOrders, useDeleteOrder, useGetOrders, useUpdateOrder } from "@/hooks/order";
import { Order, OrderStatus } from "@/services/types";
import { Card } from "@mui/material";
import { OrdersListTable } from ".";

export function OrdersList() {
  const { state: { orderFilter } } = useStore();

  // Queries
  const ordersQuery = useGetOrders({
    filter: orderFilter.where,
    pagination: orderFilter.pagination || INITIAL_PAGINATION,
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
  const deleteOrderMutation = useDeleteOrder();
  const deleteOrdersMutation = useDeleteMultiOrders();
  const updateOrderMutation = useUpdateOrder();

  // Extraction
  const data = ordersQuery.try_data.ok_or_throw();

  function handleChangeStatusOrder(order: Order, status: OrderStatus) {
    if (!order.billingAddressId) return;

    updateOrderMutation.mutate({
      id: order.id,
      payload: {
        ...order,
        status,
        deliveryAddressId: order.deliveryAddressId || undefined,
        pickupAddressId: order.pickupAddressId || undefined,
        billingAddressId: order.billingAddressId,
        remark: order.remark || undefined,
      },
    });
  }

  if (!data || ordersQuery.isLoading) return <SuspenseLoader />;

  function handleDeleteOrder(id: string) {
    deleteOrderMutation.mutate(id);
  }

  function handleDeleteMultiOrders(ids: string[]) {
    deleteOrdersMutation.mutate(ids);
  }

  return (
    <Card>
      <OrdersListTable
        onStatusChange={handleChangeStatusOrder}
        isLoading={ordersQuery.isLoading}
        orders={data.results}
        count={data.count}
        onDelete={handleDeleteOrder}
        onMultiDelete={handleDeleteMultiOrders}
      />
    </Card>
  );
}
