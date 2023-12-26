import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { CouponsListTable } from ".";
import { createMultiCouponsFn, deleteCouponFn, deleteMultiCouponsFn, getCouponsFn } from "@/services/couponsApi";


export function CouponsList() {
  const { state: {couponFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["coupons", { filter: couponFilter } ],
    queryFn: args => getCouponsFn(args, { 
      filter: couponFilter?.fields,
      pagination: {
        page: couponFilter?.page || 1,
        pageSize: couponFilter?.limit || 10
      },
      include: {
        product: true
      }
    }),
    select: data => data
  })

  const {
    mutate: createCoupons
  } = useMutation({
    mutationFn: createMultiCouponsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new coupon.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["coupons"]
      })
    }
  })

  const {
    mutate: deleteCoupon
  } = useMutation({
    mutationFn: deleteCouponFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a coupon.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["coupons"]
      })
    }
  })

  const {
    mutate: deleteCoupons
  } = useMutation({
    mutationFn: deleteMultiCouponsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete coupons.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["coupons"]
      })
    }
  })

  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyCoupons(buf: ArrayBuffer) {
    createCoupons(buf)
  }

  function handleDeleteCoupon(id: string) {
    deleteCoupon(id)
  }

  function handleDeleteMultiCoupons(ids: string[]) {
    deleteCoupons(ids)
  }

  return <Card>
    <CouponsListTable
      coupons={data.results} 
      count={data.count} 
      onCreateManyCoupons={handleCreateManyCoupons} 
      onDelete={handleDeleteCoupon}
      onMultiDelete={handleDeleteMultiCoupons}
    />
  </Card>
}
