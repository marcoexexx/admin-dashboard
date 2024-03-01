import { Box, Grid, TextField } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useEffect } from "react";
import { useCreateRole } from "@/hooks/role";


const createRoleSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1).max(128),
  permissions: string().array().default([])
})
export type CreateRoleInput = z.infer<typeof createRoleSchema>

export function CreateRoleForm() {
  const createRoleMutation = useCreateRole()

  const methods = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema)
  })

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  const onSubmit: SubmitHandler<CreateRoleInput> = (value) => {
    createRoleMutation.mutate(value)
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
            <MuiButton variant="contained" type="submit" loading={createRoleMutation.isPending}>Create</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}

