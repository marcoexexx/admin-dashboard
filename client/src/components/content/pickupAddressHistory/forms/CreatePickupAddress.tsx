import { FormModal } from "@/components/forms";
import { DatePickerField, RegionInputField, TownshipByRegionInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage, useStore } from "@/hooks";
import { useCreatePickupAddress } from "@/hooks/pickupAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, z } from "zod";
import { CreateRegionForm } from "../../regions/forms";
import { CreateTownshipForm } from "../../townships/forms";

const createPickupAddressSchema = object({
  username: string({ required_error: "" }).min(3).max(1024),
  phone: string().regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/),
  email: string().email(),
  date: z.any(),
});

export type CreatePickupAddressInput = z.infer<typeof createPickupAddressSchema>;

export function CreatePickupAddressForm() {
  const { state: { modalForm, user } } = useStore();

  const { mutate: createPickupAddress, isPending } = useCreatePickupAddress();

  const methods = useForm<CreatePickupAddressInput>({
    resolver: zodResolver(createPickupAddressSchema),
  });

  useBeforeUnloadPage();

  useEffect(() => {
    if (!!user) {
      methods.setValue("username", user.name);
      methods.setValue("email", user.email);
    }
  }, [user]);

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<CreatePickupAddressInput> = (value) => {
    createPickupAddress(value);
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
              <DatePickerField fieldName="date" />
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
