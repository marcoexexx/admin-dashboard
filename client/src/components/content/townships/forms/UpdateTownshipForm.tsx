import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, object, string, z } from "zod";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetTownship, useUpdateTownship } from "@/hooks/township";


const updateTownshipSchema = object({
  name: string({ required_error: "name is required" }),
  fees: number({ required_error: "fees is required" }),
  regionId: string().optional()
})

export type UpdateTownshipInput = z.infer<typeof updateTownshipSchema>

export function UpdateTownshipForm() {
  const { townshipId } = useParams()

  const { try_data, isSuccess, fetchStatus } = useGetTownship({ id: townshipId })
  const { mutate: updateTownship } = useUpdateTownship()

  const township = try_data.ok_or_throw()


  const methods = useForm<UpdateTownshipInput>({
    resolver: zodResolver(updateTownshipSchema),
  })

  useEffect(() => {
    if (isSuccess && township && fetchStatus === "idle") {
      methods.setValue("name", township.name)
      methods.setValue("fees", township.fees)
    }
  }, [isSuccess, fetchStatus])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateTownshipInput> = (value) => {
    if (townshipId) updateTownship({ id: townshipId, payload: value })
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
                label="Township name" 
                error={!!errors.name} 
                helperText={!!errors.name ? errors.name.message : ""} 
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


