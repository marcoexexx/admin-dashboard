import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { DatePickerField, RegionInputField, TownshipByRegionInputField } from "@/components/input-fields";
import { FormModal } from "@/components/forms";
import { CreateRegionForm } from "../../regions/forms";
import { CreateTownshipForm } from "../../townships/forms";
import { Resource } from "@/context/cacheKey";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { useEffect } from "react";
import { playSoundEffect } from "@/libs/playSound";


const createPickupAddressSchema = object({
  username: string({ required_error: "" }).min(3).max(1024),
  phone: string().regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/),
  email: string().email(),
  date: z.any(),
})

export type CreatePickupAddressInput = z.infer<typeof createPickupAddressSchema>

export function CreatePickupAddressForm() {
  const { state: {modalForm, user}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/pickup-addresses"

  const {
    mutate: createPickupAddress,
  } = useMutation({
    // mutationFn: createPickupAddressFn,
    mutationFn: (_: CreatePickupAddressInput) => Promise.reject(undefined),
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new pickup address.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: [Resource.UserAddress]
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

  const methods = useForm<CreatePickupAddressInput>({
    resolver: zodResolver(createPickupAddressSchema)
  })

  useEffect(() => {
    if (!!user) {
      methods.setValue("username", user.name)
      methods.setValue("email", user.email)
    }
  }, [user])

  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_MODAL_FORM", payload: "*" })
  }

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<CreatePickupAddressInput> = (value) => {
    createPickupAddress(value)
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("username")} 
                label="Name" 
                error={!!errors.username} 
                helperText={!!errors.username ? errors.username.message : ""} 
              />
              <RegionInputField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("phone")} 
                label="Phone" 
                error={!!errors.phone} 
                helperText={!!errors.phone ? errors.phone.message : ""} 
              />
              <TownshipByRegionInputField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <DatePickerField fieldName="date" />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("email")} 
                label="Email" 
                error={!!errors.email} 
                helperText={!!errors.email ? errors.email.message : ""} 
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>


      {modalForm.field === "region"
      ? <FormModal field='region' title='Create new region' onClose={handleOnCloseModalForm}>
        <CreateRegionForm />
      </FormModal>
      : null}

      {modalForm.field === "townships"
      ? <FormModal field='townships' title='Create new township' onClose={handleOnCloseModalForm}>
        <CreateTownshipForm />
      </FormModal>
      : null}
    </>
  )
}


