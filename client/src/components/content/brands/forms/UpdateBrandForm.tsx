import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetBrand, useUpdateBrand } from "@/hooks/brand";


const updateBrandSchema = object({
  name: string()
    .min(0).max(128).optional()
})

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>

export function UpdateBrandForm() {
  const { brandId } = useParams()

  // Quries
  const brandQuery = useGetBrand({
    id: brandId,
  })

  // Mutations
  const updateBrandMutation = useUpdateBrand()

  // Extraction
  const brand = brandQuery.try_data.ok_or_throw()
  const brandFetchStatus = brandQuery.fetchStatus

  const methods = useForm<UpdateBrandInput>({
    resolver: zodResolver(updateBrandSchema),
  })

  useEffect(() => {
    if (brandQuery.isSuccess && brand && brandFetchStatus === "idle") methods.setValue("name", brand.name)
  }, [brandQuery.isSuccess, brandFetchStatus])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateBrandInput> = (value) => {
    if (brandId) updateBrandMutation.mutate({ brandId, brand: value })
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

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={updateBrandMutation.isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}


