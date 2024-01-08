import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { getCityFn, updateCityFn } from "@/services/citiesApi";


const updateCitySchema = object({
  city: string({ required_error: "city name is required" }),
  fees: number({ required_error: "fees is required" }),
  regionId: string().optional()
})

export type UpdateCityInput = z.infer<typeof updateCitySchema>

export function UpdateCityForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { cityId } = useParams()
  const from = "/cities"

  const { 
    data: city,
    isSuccess: isSuccessFetchCity,
    fetchStatus: fetchStatusCity
  } = useQuery({
    enabled: !!cityId,
    queryKey: ["cities", { id: cityId }],
    queryFn: args => getCityFn(args, { cityId }),
    select: data => data?.city
  })

  const {
    mutate: updateCity,
  } = useMutation({
    mutationFn: updateCityFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a city.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        // queryKey: ["brands", { id: brandId }],
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

  const methods = useForm<UpdateCityInput>({
    resolver: zodResolver(updateCitySchema),
  })

  useEffect(() => {
    if (isSuccessFetchCity && city && fetchStatusCity === "idle") {
      methods.setValue("city", city.city)
      methods.setValue("fees", city.fees)
    }
  }, [isSuccessFetchCity, fetchStatusCity])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("city")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateCityInput> = (value) => {
    if (cityId) updateCity({ cityId, city: value })
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

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}


