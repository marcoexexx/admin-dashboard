import { DatePickerField, ProductInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage } from "@/hooks";
import { useCreateCoupon } from "@/hooks/coupon";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { any, boolean, number, object, string, z } from "zod";

const createCouponSchema = object({
  points: number({ required_error: "Points is required" })
    .min(0)
    .max(1_000),
  dolla: number({ required_error: "Dolla is required" })
    .min(0)
    .max(10),
  productId: string().optional(),
  isUsed: boolean().default(false),
  expiredDate: any(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

export function CreateCouponForm() {
  // Mutations
  const createCouponMutation = useCreateCoupon();

  const methods = useForm<CreateCouponInput>({
    resolver: zodResolver(createCouponSchema),
  });

  useBeforeUnloadPage();

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<CreateCouponInput> = (value) => {
    createCouponMutation.mutate({ ...value, expiredDate: value.expiredDate?.toISOString() });
  };

  return (
    <FormProvider {...methods}>
      <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <TextField
              {...register("points", {
                valueAsNumber: true,
              })}
              type="number"
              label="Points"
              error={!!errors.points}
              helperText={!!errors.points ? errors.points.message : ""}
              fullWidth
            />
            <TextField
              fullWidth
              {...register("dolla", {
                valueAsNumber: true,
              })}
              type="number"
              inputProps={{
                step: "0.01",
              }}
              label="Dolla"
              error={!!errors.dolla}
              helperText={!!errors.dolla ? errors.dolla.message : ""}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
            <ProductInputField />
            <DatePickerField required fieldName="expiredDate" />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <MuiButton variant="contained" type="submit" loading={createCouponMutation.isPending}>
            Create
          </MuiButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
