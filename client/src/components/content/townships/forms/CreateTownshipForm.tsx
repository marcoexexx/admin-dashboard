import { MuiButton } from "@/components/ui";
import { useCreateTownship } from "@/hooks/township";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { number, object, string, z } from "zod";

const createTownshipSchema = object({
  name: string({ required_error: "name is required" }),
  fees: number({ required_error: "fees is required" }),
  regionId: string().optional(),
});

export type CreateTownshipInput = z.infer<typeof createTownshipSchema>;

export function CreateTownshipForm() {
  const { mutate: createTownship, isPending } = useCreateTownship();

  const methods = useForm<CreateTownshipInput>({
    resolver: zodResolver(createTownshipSchema),
  });

  const { handleSubmit, register, formState: { errors }, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<CreateTownshipInput> = (value) => {
    createTownship(value);
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
                label="Township"
                error={!!errors.name}
                helperText={!!errors.name ? errors.name.message : ""}
              />
              <TextField
                fullWidth
                {...register("fees", {
                  valueAsNumber: true,
                })}
                type="number"
                inputProps={{
                  step: "0.01",
                }}
                label="Fees"
                error={!!errors.fees}
                helperText={!!errors.fees ? errors.fees.message : ""}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={isPending}>Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
