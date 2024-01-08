import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { useEffect } from "react";
import { createRegionFn } from "@/services/regionsApi";


const createRegionSchema = object({
  name: string({ required_error: "Region name is required" })
    .min(1).max(128),
  cities: string().array().default([])
})

export type CreateRegionInput = z.infer<typeof createRegionSchema>

export function CreateRegionForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/regions"

  const {
    mutate: createBrand,
  } = useMutation({
    mutationFn: createRegionFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new brand.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["regions"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateRegionInput>({
    resolver: zodResolver(createRegionSchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<CreateRegionInput> = (value) => {
    createBrand(value)
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("name")} 
                label="Name" 
                error={!!errors.name} 
                helperText={!!errors.name ? errors.name.message : ""} 
              />
            </Box>
          </Grid>

          {/* Multi City InputField */}

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}

