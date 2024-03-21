import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage } from "@/hooks";
import { useGetCategory, useUpdateCategory } from "@/hooks/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { object, string, z } from "zod";

const updateCategorySchema = object({
  name: string()
    .min(0).max(128).optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export function UpdateCategoryForm() {
  const { categoryId } = useParams();

  // Queries
  const categoryQuery = useGetCategory({
    id: categoryId,
  });

  // Mutations
  const updateCategoryMutation = useUpdateCategory();

  // Extraction
  const category = categoryQuery.try_data.ok_or_throw();
  const categoryFetchStatus = categoryQuery.fetchStatus;

  const methods = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
  });

  useBeforeUnloadPage();

  useEffect(() => {
    if (categoryQuery.isSuccess && category && categoryFetchStatus === "idle") methods.setValue("name", category.name);
  }, [categoryQuery.isSuccess, categoryFetchStatus]);

  const { handleSubmit, register, formState: { errors }, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<UpdateCategoryInput> = (value) => {
    if (categoryId) updateCategoryMutation.mutate({ id: categoryId, payload: value });
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
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={updateCategoryMutation.isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
