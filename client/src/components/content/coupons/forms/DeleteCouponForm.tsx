import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { object, string, z } from "zod";
import { deleteCouponFn } from "@/services/couponsApi";


const deleteCouponSchema = object({
  couponId: string({ required_error: "Coupon id is required" })
    .min(1).max(128)
})

export type DeleteCouponInput = z.infer<typeof deleteCouponSchema>


interface DeleteCouponFormProps {
  couponId: string
}

export function DeleteExchangeForm(props: DeleteCouponFormProps) {
  const { couponId } = props
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/coupons"

  const {
    mutate: deleteCoupon,
  } = useMutation({
    mutationFn: deleteCouponFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success deleted a coupon.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["coupons"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed delete coupon.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<DeleteCouponInput>({
    resolver: zodResolver(deleteCouponSchema),
    defaultValues: {
      couponId
    }
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<DeleteCouponInput> = (value) => {
    deleteCoupon(value.couponId)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth sx={{ display: "none" }} {...register("couponId")} label="Coupon" error={!!errors.couponId} helperText={!!errors.couponId ? errors.couponId.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="outlined" type="submit">Delete</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

