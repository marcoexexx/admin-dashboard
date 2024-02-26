import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField, ProductInputField } from "@/components/input-fields";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, boolean, number, object, string, z } from "zod";
import { useParams } from "react-router-dom";
import { useGetCoupon, useUpdateCoupon } from "@/hooks/coupon";

import dayjs from "dayjs";


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
  const { couponId } = useParams()

  // Quries
  const couponQuery = useGetCoupon({
    id: couponId,
    include: {}
  })

  // Mutations
  const updateCouponMutation = useUpdateCoupon()

  // Extraction
  const coupon = couponQuery.try_data.ok_or_throw()
  const couponFetchStatus = couponQuery.fetchStatus


  const methods = useForm<UpdateCouponInput>({
    resolver: zodResolver(updateCouponSchema),
    defaultValues: {
      expiredDate: dayjs()
    }
  })

  useEffect(() => {
    if (couponQuery.isSuccess && coupon && couponFetchStatus === "idle") {
      methods.setValue("points", coupon.points)
      methods.setValue("dolla", coupon.dolla)
      methods.setValue("productId", coupon.productId)
      methods.setValue("expiredDate", dayjs(coupon.expiredDate))
      methods.setValue("isUsed", coupon.isUsed)
    }
  }, [couponQuery.isSuccess, couponFetchStatus])

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateCouponInput> = (value) => {
    if (couponId) updateCouponMutation.mutate({ id: couponId, payload: value })
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
          <MuiButton variant="contained" type="submit" loading={updateCouponMutation.isPending}>Save</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}


