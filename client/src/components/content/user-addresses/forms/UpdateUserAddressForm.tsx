import { Box, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, object, string, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { getUserAddressFn, updateUserAddressFn } from "@/services/userAddressApi";
import { RegionInputField, TownshipByRegionInputField } from "@/components/input-fields";


const updateUserAddressSchema = object({
  isDefault: boolean().default(false),
  username: string({ required_error: "Name (username) is required" }),
  phone: string({ required_error: "phone is required" }).min(9).max(12),
  email: string({ required_error: "email is required" }).email(),
  regionId: string({ required_error: "region is required" }),
  townshipFeesId: string({ required_error: "township is required" }),
  fullAddress: string({ required_error: "fullAddress is required" }).max(128),
})

export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>

export function UpdateUserAddressForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { userAddressId } = useParams()
  const from = "/addresses"

  const { 
    data: userAddress,
    isSuccess: isSuccessFetchUserAddress,
    fetchStatus: fetchStatusUserAddress
  } = useQuery({
    enabled: !!userAddressId,
    queryKey: ["user-addresses", { id: userAddressId }],
    queryFn: args => getUserAddressFn(args, { userAddressId }),
    select: data => data?.userAddress
  })

  const {
    mutate: updateUserAddress,
  } = useMutation({
    mutationFn: updateUserAddressFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a user address.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["user-addresses"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<UpdateUserAddressInput>({
    resolver: zodResolver(updateUserAddressSchema),
  })

  useEffect(() => {
    if (isSuccessFetchUserAddress && userAddress && fetchStatusUserAddress === "idle") {
      methods.setValue("username", userAddress.username)
      methods.setValue("phone", userAddress.phone)
      methods.setValue("email", userAddress.email)
      methods.setValue("fullAddress", userAddress.fullAddress)
      methods.setValue("isDefault", userAddress.isDefault)

      if (userAddress.regionId) methods.setValue("regionId", userAddress.regionId)
      if (userAddress.townshipFeesId) methods.setValue("townshipFeesId", userAddress.townshipFeesId)
    }
  }, [isSuccessFetchUserAddress, fetchStatusUserAddress])


  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<UpdateUserAddressInput> = (value) => {
    if (userAddressId) updateUserAddress({ userAddressId, address: value })
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
                focused
                label="Username" 
                error={!!errors.username} 
                helperText={!!errors.username ? errors.username.message : ""} 
              />
              <RegionInputField updateField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("phone")} 
                focused
                label="Phone" 
                error={!!errors.phone} 
                helperText={!!errors.phone ? errors.phone.message : ""} 
              />
              <TownshipByRegionInputField updateField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <TextField 
                fullWidth 
                {...register("email")} 
                focused
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
                focused
                label="Full address" 
                error={!!errors.fullAddress} 
                helperText={!!errors.fullAddress ? errors.fullAddress.message : ""} 
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              label="Set as default address"
              control={<Switch
                {...register("isDefault")}
              />}
            />
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}
