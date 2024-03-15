import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useCreateCategory } from "@/hooks/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, string, z } from "zod";

const createCategorySchema = object({
  name: string({ required_error: "Category name is required" })
    .min(1).max(128),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export function CreateCategoryForm() {
  const { dispatch } = useStore();

  // Mutations
  const createCategoryMutation = useCreateCategory();

  const methods = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
  });

  const { handleSubmit, register, formState: { errors }, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<CreateCategoryInput> = (value) => {
    createCategoryMutation.mutate(value);
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
  };

  return (
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
          <MuiButton variant="contained" type="submit" loading={createCategoryMutation.isPending}>Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
