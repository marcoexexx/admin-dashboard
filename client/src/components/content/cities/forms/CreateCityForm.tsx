import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { createCityFn } from "@/services/citiesApi";


const createCitySchema = object({
  city: string({ required_error: "city name is required" }),
  fees: number({ required_error: "fees is required" }),
  regionId: string().optional()
})

export type CreateCityInput = z.infer<typeof createCitySchema>

export function CreateCityForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/cities"

  const {
    mutate: createCity,
  } = useMutation({
    mutationFn: createCityFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new city.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["cities"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateCityInput>({
    resolver: zodResolver(createCitySchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("city")
  }, [setFocus])

  const onSubmit: SubmitHandler<CreateCityInput> = (value) => {
    createCity(value)
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("city")} 
                label="City name" 
                error={!!errors.city} 
                helperText={!!errors.city ? errors.city.message : ""} 
              />
              <TextField 
                fullWidth 
                {...register("fees", {
                  valueAsNumber: true
                })} 
                type="number"
                inputProps={{
                  step: "0.01"
                }}
                label="Fees" 
                error={!!errors.fees} 
                helperText={!!errors.fees ? errors.fees.message : ""} 
              />
            </Box>
          </Grid>

          {/* TODO: RegionInputfield */}

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}

