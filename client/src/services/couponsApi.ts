import { CreateCouponInput, DeleteCouponInput, UpdateCouponInput } from "@/components/content/coupons/forms";
import { authApi } from "./authApi";


export async function getCouponsFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: any, include: any }) {
  const { data } = await authApi.get<HttpListResponse<Coupon>>("/coupons", {
    ...opt,
    params: {
      filter,
      pagination,
      include
    },
  })
  return data
}


export async function getCouponFn(opt: QueryOptionArgs, { couponId, include }: { couponId: string | undefined, include: any }) {
  if (!couponId) return
  const { data } = await authApi.get<CouponResponse>(`/coupons/detail/${couponId}`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function createCouponFn(coupon: CreateCouponInput) {
  const { data } = await authApi.post<CouponResponse>("/coupons", coupon)
  return data
}


export async function createMultiCouponsFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Coupons_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/coupons/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return data
}


export async function updateCouponFn({couponId, coupon}: {couponId: string, coupon: UpdateCouponInput}) {
  const { data } = await authApi.patch<CouponResponse>(`/coupons/detail/${couponId}`, coupon)
  return data
}


export async function deleteMultiCouponsFn(couponIds: DeleteCouponInput["couponId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/coupons/multi", { data: { couponIds } })
  return data
}


export async function deleteCouponFn(couponId: DeleteCouponInput["couponId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/coupons/detail/${couponId}`)
  return data
}

