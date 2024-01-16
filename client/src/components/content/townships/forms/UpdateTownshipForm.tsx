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
import { getTownshipFn, updateTownshipFn } from "@/services/TownshipsApi";
import { playSoundEffect } from "@/libs/playSound";


const updateTownshipSchema = object({
  name: string({ required_error: "name is required" }),
  fees: number({ required_error: "fees is required" }),
  regionId: string().optional()
})

export type UpdateTownshipInput = z.infer<typeof updateTownshipSchema>

export function UpdateTownshipForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { townshipId } = useParams()
  const from = "/cities"

  const { 
    data: township,
    isSuccess: isSuccessFetchTownship,
    fetchStatus: fetchStatusTownship
  } = useQuery({
    enabled: !!townshipId,
    queryKey: ["townships", { id: townshipId }],
    queryFn: args => getTownshipFn(args, { townshipId }),
    select: data => data?.township
  })

  const {
    mutate: updateTownship,
  } = useMutation({
    mutationFn: updateTownshipFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a city.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["townships"]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const methods = useForm<UpdateTownshipInput>({
    resolver: zodResolver(updateTownshipSchema),
  })

  useEffect(() => {
    if (isSuccessFetchTownship && township && fetchStatusTownship === "idle") {
      methods.setValue("name", township.name)
      methods.setValue("fees", township.fees)
    }
  }, [isSuccessFetchTownship, fetchStatusTownship])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateTownshipInput> = (value) => {
    if (townshipId) updateTownship({ townshipId, township: value })
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


