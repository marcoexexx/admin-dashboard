import { EditorInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage } from "@/hooks";
import { useGetShopowner, useUpdateShopowner } from "@/hooks/shopowner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { object, string, z } from "zod";

const updateShopownerSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1).max(128),
  remark: string({ required_error: "Remark is required" })
    .max(5000).optional(),
});

export type UpdateShopownerInput = z.infer<typeof updateShopownerSchema>;

export function UpdateShopownerForm() {
  const { shopownerId } = useParams();

  // Queries
  const shopownerQuery = useGetShopowner({
    id: shopownerId,
  });

  // Mutations
  const updateShopownerMutation = useUpdateShopowner();

  // Extraction
  const shopowner = shopownerQuery.try_data.ok_or_throw();
  const shopownerFetchStatus = shopownerQuery.fetchStatus;

  const methods = useForm<UpdateShopownerInput>({
    resolver: zodResolver(updateShopownerSchema),
  });

  useBeforeUnloadPage();

  useEffect(() => {
    if (shopownerQuery.isSuccess && shopowner && shopownerFetchStatus === "idle") {
      methods.setValue("name", shopowner.name);
      methods.setValue("remark", shopowner.remark);
    }
  }, [shopownerQuery.isSuccess, shopownerFetchStatus]);

  const { handleSubmit, register, formState: { errors }, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<UpdateShopownerInput> = (value) => {
    if (shopownerId) updateShopownerMutation.mutate({ id: shopownerId, payload: value });
  };

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <TextField
                fullWidth
                {...register("name")}
                label="Name"
                error={!!errors.name}
                helperText={!!errors.name ? errors.name.message : ""}
              />
              <EditorInputField fieldName="remark" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={updateShopownerMutation.isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
