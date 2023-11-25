import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { deleteBrandFn } from "@/services/brandsApi";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { object, string, z } from "zod";

const deleteBrandSchema = object({
  brandId: string({ required_error: "Brand id is required" })
    .min(1).max(128)
})

export type DeleteBrandInput = z.infer<typeof deleteBrandSchema>


interface DeleteBrandFormProps {
  brandId: string
}

export function DeleteBrandForm(props: DeleteBrandFormProps) {
  const { brandId } = props
  const { dispatch } = useStore()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname || "/brands"

  const {
    mutate: deleteBrand,
  } = useMutation({
    mutationFn: deleteBrandFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success deleted a new brand.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["brands"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed delete a new brand.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<DeleteBrandInput>({
    resolver: zodResolver(deleteBrandSchema),
    defaultValues: {
      brandId
    }
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<DeleteBrandInput> = (value) => {
    deleteBrand(value.brandId)
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth sx={{ display: "none" }} {...register("brandId")} label="Name" error={!!errors.brandId} helperText={!!errors.brandId ? errors.brandId.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="outlined" type="submit">Delete</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

