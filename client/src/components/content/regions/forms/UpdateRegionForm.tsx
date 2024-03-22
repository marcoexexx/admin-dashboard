import { FormModal } from "@/components/forms";
import { TownshipMultiInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage, useStore } from "@/hooks";
import { useGetRegion, useUpdateRegion } from "@/hooks/region";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { object, string, z } from "zod";
import { CreateTownshipForm } from "../../townships/forms";

const updateRegionSchema = object({
  name: string()
    .min(0).max(128).optional(),
  townships: string().array().default([]),
});

export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;

export function UpdateRegionForm() {
  const { state: { modalForm } } = useStore();

  const { regionId } = useParams();

  const { try_data, isSuccess, fetchStatus } = useGetRegion({
    id: regionId,
  });
  const { mutate: updateRegion, isPending } = useUpdateRegion();

  const region = try_data.ok_or_throw();

  const methods = useForm<UpdateRegionInput>({
    resolver: zodResolver(updateRegionSchema),
  });

  useBeforeUnloadPage();

  useEffect(() => {
    if (isSuccess && region && fetchStatus === "idle") {
      methods.setValue("name", region.name);
      if (region.townships) {
        methods.setValue(
          "townships",
          region.townships.map(township => township.id),
        );
      }
    }
  }, [isSuccess, fetchStatus]);

  const { handleSubmit, register, formState: { errors }, setFocus } =
    methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<UpdateRegionInput> = (value) => {
    if (regionId) updateRegion({ id: regionId, payload: value });
  };

  return (
    <>
      <FormProvider {...methods}>
        <Grid
          container
          spacing={1}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <TextField
                fullWidth
                {...register("name")}
                focused
                label="Name"
                error={!!errors.name}
                helperText={!!errors.name ? errors.name.message : ""}
              />
              <TownshipMultiInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton
              variant="contained"
              type="submit"
              loading={isPending}
            >
              Save
            </MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      {modalForm.field === "create-township"
        ? (
          <FormModal field="create-township" title="Create new city">
            <CreateTownshipForm />
          </FormModal>
        )
        : null}
    </>
  );
}
