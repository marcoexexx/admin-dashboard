import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OperationAction, Resource } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetPermission, useUpdatePermission } from "@/hooks/permission";


const updatePermissionSchema = object({
  action: z.nativeEnum(OperationAction, { required_error: "actin is required." }),
  resource: z.nativeEnum(Resource, { required_error: "resource is required." }),
})

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>

export function UpdatePermissionForm() {
  const { permissionId } = useParams()

  // Queries
  const { try_data, fetchStatus: permissionFetchStatus, isSuccess } = useGetPermission({
    id: permissionId,
  })

  // Mutations
  const { mutate: updatePermisison, isPending } = useUpdatePermission()

  // Extraction
  const permission = try_data.ok_or_throw()

  const methods = useForm<UpdatePermissionInput>({
    resolver: zodResolver(updatePermissionSchema),
  })

  useEffect(() => {
    if (isSuccess && permission && permissionFetchStatus === "idle") {
      methods.setValue("resource", permission.resource)
      methods.setValue("action", permission.action)
    }
  }, [isSuccess, permissionFetchStatus])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("resource")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdatePermissionInput> = (value) => {
    if (permissionId) updatePermisison({ id: permissionId, payload: value })
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
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
  )
}


