import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { CouponsListTable } from ".";
import { useStore } from "@/hooks";
import { useCreateMultiCoupons, useDeleteCoupon, useDeleteMultiCoupons, useGetCoupons } from "@/hooks/coupon";


export function CouponsList() {
  const { state: {couponFilter} } = useStore()

  // Queries
  const couponsQuery = useGetCoupons({
    filter: couponFilter?.fields,
    pagination: {
      page: couponFilter?.page || 1,
      pageSize: couponFilter?.limit || 10
    },
    include: {
      product: true
    }
  })

  // Mutations
  const createCouponsMutation = useCreateMultiCoupons()
  const deleteCouponMutation = useDeleteCoupon()
  const deleteCouponsMutation = useDeleteMultiCoupons()

  // Extraction
  const data = couponsQuery.try_data.ok_or_throw()

  function handleCreateManyCoupons(buf: ArrayBuffer) {
    createCouponsMutation.mutate(buf)
  }

  function handleDeleteCoupon(id: string) {
    deleteCouponMutation.mutate(id)
  }

  function handleDeleteMultiCoupons(ids: string[]) {
    deleteCouponsMutation.mutate(ids)
  }


  // TODO: Skeleton table loader
  if (!data || couponsQuery.isLoading) return <SuspenseLoader />

  return <Card>
    <CouponsListTable
      coupons={data.results} 
      count={data.count} 
      isLoading={couponsQuery.isLoading}
      onCreateManyCoupons={handleCreateManyCoupons} 
      onDelete={handleDeleteCoupon}
      onMultiDelete={handleDeleteMultiCoupons}
    />
  </Card>
}
