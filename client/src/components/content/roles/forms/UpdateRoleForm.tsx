import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetRole, useUpdateRole } from "@/hooks/role";


const updateRoleSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1).max(128),
  permissions: string().array().default([])
})
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>

export function UpdateRoleForm() {
  const { roleId } = useParams()

  // Queries
  const roleQuery = useGetRole({
    id: roleId,
  })

  // Mutations
  const updateRoleMutation = useUpdateRole()

  // Extraction
  const role = roleQuery.try_data.ok_or_throw()
  const roleFetchStatus = roleQuery.fetchStatus

  const methods = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
  })

  useEffect(() => {
    if (roleQuery.isSuccess && role && roleFetchStatus === "idle") methods.setValue("name", role.name)
  }, [roleQuery.isSuccess, roleFetchStatus])


  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateRoleInput> = (value) => {
    if (roleId) updateRoleMutation.mutate({ id: roleId, payload: value })
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
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
            <MuiButton variant="contained" type="submit" loading={updateRoleMutation.isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}


