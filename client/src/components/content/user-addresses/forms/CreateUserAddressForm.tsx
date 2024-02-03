import { Box, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { EditorInputField, RegionInputField, TownshipByRegionInputField } from "@/components/input-fields";
import { FormModal } from "@/components/forms";
import { CreateRegionForm } from "../../regions/forms";
import { CreateTownshipForm } from "../../townships/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, object, string, z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/components";
import { createUserAddressFn } from "@/services/userAddressApi";
import { useEffect } from "react";
import { playSoundEffect } from "@/libs/playSound";


const createUserAddressSchema = object({
  isDefault: boolean().default(false),
  username: string({ required_error: "Name (username) is required" }),
  phone: string({ required_error: "phone is required" }).min(9).max(12),
  email: string({ required_error: "email is required" }).email(),
  regionId: string({ required_error: "region is required" }),
  townshipFeesId: string({ required_error: "township is required" }),
  fullAddress: string({ required_error: "fullAddress is required" }).min(1).max(128),
  remark: string().optional()
})

export type CreateUserAddressInput = z.infer<typeof createUserAddressSchema>

export function CreateUserAddressForm() {
  const { state: {modalForm, user}, dispatch } = useStore()

  const navigate = useNavigate()
  const from = "/addresses"

  const {
    mutate: createUserAddress,
  } = useMutation({
    mutationFn: createUserAddressFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new brand.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["user-addresses"]
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

  const methods = useForm<CreateUserAddressInput>({
    resolver: zodResolver(createUserAddressSchema)
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

  const onSubmit: SubmitHandler<CreateUserAddressInput> = (value) => {
    createUserAddress(value)
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
              <TextField 
                fullWidth 
                {...register("email")} 
                label="Email" 
                error={!!errors.email} 
                helperText={!!errors.email ? errors.email.message : ""} 
              />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("fullAddress")} 
                label="Full address" 
                error={!!errors.fullAddress} 
                helperText={!!errors.fullAddress ? errors.fullAddress.message : ""} 
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <EditorInputField fieldName="remark" />
            <FormControlLabel
              label="Set as default address"
              control={<Switch
                {...register("isDefault")}
              />}
            />
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

