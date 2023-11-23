import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createBrandFn } from "@/services/brandsApi";
import { useStore } from "@/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";

const createBrandSchema = object({
  name: string({ required_error: "Brand name is required" })
    .min(1).max(128)
})

export type CreateBrandInput = z.infer<typeof createBrandSchema>

export function CreateBrandForm() {
  const { dispatch } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  // TODO: Debug
  const from = ((location.state as any)?.from.pathname as string) || "/brands"

  const {
    mutate: createBrand,
  } = useMutation({
    mutationFn: createBrandFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new brand.",
        severity: "success"
      } })
      navigate(from)
      queryClient.invalidateQueries({
        queryKey: ["brands"]
      })
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "failed created a new brand.",
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateBrandInput>({
    resolver: zodResolver(createBrandSchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreateBrandInput> = (value) => {
    createBrand(value)
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item md={6} xs={12}>
          <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField fullWidth {...register("name")} label="Name" error={!!errors.name} helperText={!!errors.name ? errors.name.message : ""} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit">Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

