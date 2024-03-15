import { FormModal } from "@/components/forms";
import { PermissionMultiInputField } from "@/components/input-fields";
import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { useGetRole, useUpdateRole } from "@/hooks/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { object, string, z } from "zod";
import { CreatePermissionForm } from "../../permissions/forms";

const updateRoleSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1).max(128),
  permissions: string().array().default([]),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export function UpdateRoleForm() {
  const { roleId } = useParams();
  const { state: { modalForm } } = useStore();

  // Queries
  const roleQuery = useGetRole({
    id: roleId,
    include: {
      permissions: true,
    },
  });

  // Mutations
  const updateRoleMutation = useUpdateRole();

  // Extraction
  const role = roleQuery.try_data.ok_or_throw();
  const roleFetchStatus = roleQuery.fetchStatus;

  const methods = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
  });

  useEffect(() => {
    if (roleQuery.isSuccess && role && roleFetchStatus === "idle") {
      methods.setValue("name", role.name);
      methods.setValue("permissions", role.permissions?.map(p => p.id) || []);
    }
  }, [roleQuery.isSuccess, roleFetchStatus]);

  const { handleSubmit, register, formState: { errors }, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<UpdateRoleInput> = (value) => {
    if (roleId) updateRoleMutation.mutate({ id: roleId, payload: value });
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
            <Box sx={{ "& .MuiTextField-root": { my: 1, width: "100%" } }}>
              <PermissionMultiInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={updateRoleMutation.isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      {modalForm.field === "create-permission"
        ? (
          <FormModal field="create-permission" title="Create new permission">
            <CreatePermissionForm />
          </FormModal>
        )
        : null}
    </>
  );
}
