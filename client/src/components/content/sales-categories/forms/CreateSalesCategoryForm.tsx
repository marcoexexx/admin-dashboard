import { DatePickerField, EditorInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage, useStore } from "@/hooks";
import { useCreateSalesCategory } from "@/hooks/salsCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { boolean, object, string, z } from "zod";

const createSalesCategorySchema = object({
  name: string({ required_error: "Sales category name is required" })
    .min(1).max(128),
  startDate: z.any(),
  endDate: z.any(),
  isActive: boolean().default(true),
  description: string().optional(),
});

export type CreateSalesCategoryInput = z.infer<typeof createSalesCategorySchema>;

export function CreateSalesCategoryForm() {
  const { dispatch } = useStore();

  const { mutate: createSalesCategory, isPending } = useCreateSalesCategory();

  const methods = useForm<CreateSalesCategoryInput>({
    resolver: zodResolver(createSalesCategorySchema),
  });

  useBeforeUnloadPage();

  const { handleSubmit, register, formState: { errors }, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<CreateSalesCategoryInput> = (value) => {
    createSalesCategory(value);
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

        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <DatePickerField fieldName="endDate" required />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <DatePickerField fieldName="startDate" required />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <EditorInputField fieldName="description" />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit" loading={isPending}>Create</MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
