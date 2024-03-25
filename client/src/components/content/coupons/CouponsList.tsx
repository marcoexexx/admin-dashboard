import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import {
  useCreateMultiCoupons,
  useDeleteCoupon,
  useDeleteMultiCoupons,
  useGetCoupons,
} from "@/hooks/coupon";
import { Card } from "@mui/material";
import { CouponsListTable } from ".";

export function CouponsList() {
  const { state: { couponFilter } } = useStore();

  // Queries
  const couponsQuery = useGetCoupons({
    filter: couponFilter.where,
    pagination: couponFilter.pagination || INITIAL_PAGINATION,
    include: {
      product: true,
    },
  });

  // Mutations
  const createCouponsMutation = useCreateMultiCoupons();
  const deleteCouponMutation = useDeleteCoupon();
  const deleteCouponsMutation = useDeleteMultiCoupons();

  // Extraction
  const data = couponsQuery.try_data.ok_or_throw();

  function handleCreateManyCoupons(buf: ArrayBuffer) {
    createCouponsMutation.mutate(buf);
  }

  function handleDeleteCoupon(id: string) {
    deleteCouponMutation.mutate(id);
  }

  function handleDeleteMultiCoupons(ids: string[]) {
    deleteCouponsMutation.mutate(ids);
  }

  return (
    <Card>
      <CouponsListTable
        coupons={data?.results ?? []}
        count={data?.count ?? 0}
        isLoading={couponsQuery.isLoading}
        onCreateMany={handleCreateManyCoupons}
        onDelete={handleDeleteCoupon}
        onMultiDelete={handleDeleteMultiCoupons}
      />
    </Card>
  );
}
