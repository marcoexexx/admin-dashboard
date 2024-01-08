import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { getRegionFn, updateRegionFn } from "@/services/regionsApi";
import { CityMultiInputField } from "@/components/input-fields";
import { FormModal } from "@/components/forms";
import { CreateCityForm } from "../../cities/forms";


const updateRegionSchema = object({
  name: string()
    .min(0).max(128).optional(),
  cities: string().array().default([])
})

export type UpdateRegionInput = z.infer<typeof updateRegionSchema>

export function UpdateRegionForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { regionId } = useParams()
  const from = "/regions"

  const { 
    data: region,
    isSuccess: isSuccessFetchRegion,
    fetchStatus: fetchStatusRegion
  } = useQuery({
    enabled: !!regionId,
    queryKey: ["region", { id: regionId }],
    queryFn: args => getRegionFn(args, { regionId }),
    select: data => data?.region
  })

  const {
    mutate: updateRegion,
  } = useMutation({
    mutationFn: updateRegionFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a region.",
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

  const methods = useForm<UpdateRegionInput>({
    resolver: zodResolver(updateRegionSchema),
  })

  useEffect(() => {
    if (isSuccessFetchRegion && region && fetchStatusRegion === "idle") {
      methods.setValue("name", region.name)
      if (region.cities) methods.setValue("cities", region.cities.map(city => city.id))
    }
  }, [isSuccessFetchRegion, fetchStatusRegion])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateRegionInput> = (value) => {
    if (regionId) updateRegion({ regionId, region: value })
  }

  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "*" })
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
                focused
                label="Name" 
                error={!!errors.name} 
                helperText={!!errors.name ? errors.name.message : ""} 
              />
              <CityMultiInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
      
      {modalForm.field === "cities"
      ? <FormModal field="cities" title='Create new city' onClose={handleOnCloseModalForm}>
        <CreateCityForm />
      </FormModal>
      : null}
    </>
  )
}


