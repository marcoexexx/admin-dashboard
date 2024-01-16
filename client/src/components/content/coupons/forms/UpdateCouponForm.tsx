import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, boolean, number, object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { DatePickerField, ProductInputField } from "@/components/input-fields";
import { useEffect } from "react";
import dayjs from "dayjs";
import { getCouponFn, updateCouponFn } from "@/services/couponsApi";
import { playSoundEffect } from "@/libs/playSound";


const updateCouponSchema = object({
  points: number({ required_error: "Points is required" })
    .min(0)
    .max(1_000),
  dolla: number({ required_error: "Dolla is required" })
    .min(0)
    .max(10),
  productId: string().optional(),
  isUsed: boolean().default(false),
  rewardId: string().optional(),
  expiredDate: any()
}) 

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>

export function UpdateCouponForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { couponId } = useParams()
  const from = "/coupons"

  const { 
    data: coupon,
    isSuccess: isSuccessFetchCoupon,
    fetchStatus: fetchStatusCoupon
  } = useQuery({
    enabled: !!couponId,
    queryKey: ["coupons", { id: couponId }],
    queryFn: args => getCouponFn(args, { couponId, include: {} }),
    select: data => data?.coupon
  })

  const {
    mutate: updateCoupon,
  } = useMutation({
    mutationFn: updateCouponFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a coupon.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["coupons"]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const methods = useForm<UpdateCouponInput>({
    resolver: zodResolver(updateCouponSchema),
    defaultValues: {
      expiredDate: dayjs()
    }
  })

  useEffect(() => {
    if (isSuccessFetchCoupon && coupon && fetchStatusCoupon === "idle") {
      methods.setValue("points", coupon.points)
      methods.setValue("dolla", coupon.dolla)
      methods.setValue("productId", coupon.productId)
      methods.setValue("expiredDate", dayjs(coupon.expiredDate))
      methods.setValue("isUsed", coupon.isUsed)
    }
  }, [isSuccessFetchCoupon, fetchStatusCoupon])

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateCouponInput> = (value) => {
    if (couponId) updateCoupon({ couponId, coupon: value })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField 
              {...register("points", {
                valueAsNumber: true
              })} 
              focused
              type="number"
              label="Points" 
              error={!!errors.points} 
              helperText={!!errors.points ? errors.points.message : ""} 
              fullWidth
            />
            <TextField 
              fullWidth 
              {...register("dolla", {
                valueAsNumber: true
              })} 
              focused
              type="number"
              inputProps={{
                step: "0.01"
              }}
              label="Dolla" 
              error={!!errors.dolla} 
              helperText={!!errors.dolla ? errors.dolla.message : ""} 
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <ProductInputField updateField />
            <DatePickerField required fieldName="expiredDate" />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}


