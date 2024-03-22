import { FormModal } from "@/components/forms";
import {
  EditorInputField,
  RegionInputField,
  TownshipByRegionInputField,
} from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage, useStore } from "@/hooks";
import { useCreateUserAddress } from "@/hooks/userAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { boolean, object, string, z } from "zod";
import { CreateRegionForm } from "../../regions/forms";
import { CreateTownshipForm } from "../../townships/forms";

const createUserAddressSchema = object({
  isDefault: boolean().default(false),
  username: string({ required_error: "Name (username) is required" }),
  phone: string({ required_error: "phone is required" }).regex(
    /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  ),
  email: string({ required_error: "email is required" }).email(),
  regionId: string({ required_error: "region is required" }),
  townshipFeesId: string({ required_error: "township is required" }),
  fullAddress: string({ required_error: "fullAddress is required" }).min(1).max(128),
  remark: string().optional(),
});

export type CreateUserAddressInput = z.infer<typeof createUserAddressSchema>;

export function CreateUserAddressForm() {
  const { state: { modalForm, user } } = useStore();

  const { mutate: createUserAddress, isPending } = useCreateUserAddress();

  const methods = useForm<CreateUserAddressInput>({
    resolver: zodResolver(createUserAddressSchema),
  });

  useBeforeUnloadPage();

  useEffect(() => {
    if (!!user) {
      methods.setValue("username", user.name);
      methods.setValue("email", user.email);
    }
  }, [user]);

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<CreateUserAddressInput> = (value) => {
    createUserAddress(value);
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
                label="Name"
                error={!!errors.username}
                helperText={!!errors.username ? errors.username.message : ""}
              />
              <RegionInputField />
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
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
              control={
                <Switch
                  {...register("isDefault")}
                />
              }
            />
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={isPending}>Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      {modalForm.field === "create-region"
        ? (
          <FormModal field="create-region" title="Create new region">
            <CreateRegionForm />
          </FormModal>
        )
        : null}

      {modalForm.field === "create-township"
        ? (
          <FormModal field="create-township" title="Create new township">
            <CreateTownshipForm />
          </FormModal>
        )
        : null}
    </>
  );
}
