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
import { FormModal } from "@/components/forms";
import { TownshipMultiInputField } from "@/components/input-fields";
import { CreateTownshipForm } from "../../townships/forms";
import { playSoundEffect } from "@/libs/playSound";


const createRegionSchema = object({
  name: string({ required_error: "Region name is required" })
    .min(1).max(128),
  townships: string().array().default([])
})

export type CreateRegionInput = z.infer<typeof createRegionSchema>

export function CreateRegionForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/regions"

  const {
    mutate: createRegion,
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

  const methods = useForm<CreateRegionInput>({
    resolver: zodResolver(createRegionSchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<CreateRegionInput> = (value) => {
    createRegion(value)
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
                label="Name" 
                error={!!errors.name} 
                helperText={!!errors.name ? errors.name.message : ""} 
              />
              <TownshipMultiInputField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
      
      {modalForm.field === "townships"
      ? <FormModal field="townships" title='Create new township' onClose={handleOnCloseModalForm}>
        <CreateTownshipForm />
      </FormModal>
      : null}
    </>
  )
}

