import { MuiButton } from "@/components/ui";
import { useCreatePermission } from "@/hooks/permission";
import { OperationAction, Resource } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { object, z } from "zod";

const createPermissionSchema = object({
  action: z.nativeEnum(OperationAction, { required_error: "actin is required." }),
  resource: z.nativeEnum(Resource, { required_error: "resource is required." }),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;

export function CreatePermissionForm() {
  const { mutate: createPermisison, isPending } = useCreatePermission();

  const methods = useForm<CreatePermissionInput>({
    resolver: zodResolver(createPermissionSchema),
  });

  const { handleSubmit, setFocus, register, formState: { errors } } = methods;

  useEffect(() => {
    setFocus("action");
  }, [setFocus]);

  const onSubmit: SubmitHandler<CreatePermissionInput> = (value) => {
    createPermisison(value);
  };

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <TextField
                {...register("resource")}
                label="Resource"
                defaultValue={Resource.Product}
                select
                error={!!errors.action}
                helperText={errors.action?.message}
                fullWidth
              >
                {(Object.keys(Resource) as Resource[]).map(resource => (
                  <MenuItem key={resource} value={resource}>
                    {resource}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                {...register("action")}
                defaultValue={OperationAction.Read}
                label="Action"
                select
                error={!!errors.action}
                helperText={errors.action?.message}
                fullWidth
              >
                {(Object.keys(OperationAction) as OperationAction[]).map(action => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ))}
              </TextField>
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
