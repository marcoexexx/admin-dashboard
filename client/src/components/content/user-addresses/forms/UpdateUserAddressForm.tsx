import { EditorInputField, RegionInputField, TownshipByRegionInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage } from "@/hooks";
import { useGetUserAddress, useUpdateUserAddress } from "@/hooks/userAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { boolean, object, string, z } from "zod";

const updateUserAddressSchema = object({
  isDefault: boolean().default(false),
  username: string({ required_error: "Name (username) is required" }),
  phone: string({ required_error: "phone is required" }).regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/),
  email: string().email().optional(),
  regionId: string({ required_error: "region is required" }),
  townshipFeesId: string({ required_error: "township is required" }),
  fullAddress: string({ required_error: "fullAddress is required" }).max(128),
  remark: string().optional(),
});

export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>;

export function UpdateUserAddressForm() {
  const { userAddressId } = useParams();

  const { try_data, isSuccess, fetchStatus } = useGetUserAddress({ id: userAddressId });
  const { mutate: updateUserAddress, isPending } = useUpdateUserAddress();

  const userAddress = try_data.ok_or_throw()?.userAddress;

  const methods = useForm<UpdateUserAddressInput>({
    resolver: zodResolver(updateUserAddressSchema),
  });

  useBeforeUnloadPage();

  useEffect(() => {
    if (isSuccess && userAddress && fetchStatus === "idle") {
      methods.setValue("username", userAddress.username);
      methods.setValue("phone", userAddress.phone);
      methods.setValue("email", userAddress.email);
      methods.setValue("fullAddress", userAddress.fullAddress);
      methods.setValue("remark", userAddress.remark);
      methods.setValue("isDefault", userAddress.isDefault);

      if (userAddress.regionId) methods.setValue("regionId", userAddress.regionId);
      if (userAddress.townshipFeesId) methods.setValue("townshipFeesId", userAddress.townshipFeesId);
    }
  }, [isSuccess, fetchStatus]);

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<UpdateUserAddressInput> = (value) => {
    if (userAddressId) updateUserAddress({ id: userAddressId, payload: value });
  };

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
            <EditorInputField fieldName="remark" />
            <FormControlLabel
              label="Set as default address"
              control={
                <Switch
                  {...register("isDefault")}
                />
              }
            />
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
