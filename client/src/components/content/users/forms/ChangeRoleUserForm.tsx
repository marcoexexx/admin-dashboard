import { Box, Grid, MenuItem, Skeleton, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { MuiButton } from "@/components/ui";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";
import { useEffect } from "react";
import { useChangeRoleUser, useGetUser } from "@/hooks/user";


const userRoles = ["Admin", "User", "Shopowner"]

const updateUserSchema = object({
  role: z.enum(["User", "Admin", "Shopowner", "*"], {
    required_error: "Role is required"
  }),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export function ChangeRoleUserForm() {
  const { userId } = useParams()

  const { try_data, isSuccess } = useGetUser({ id: userId })
  const { mutate: changeRoleUser } = useChangeRoleUser()

  const user = try_data.ok_or_throw()


  const methods = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    if (isSuccess && user) methods.setValue("role", "Shopowner", { shouldValidate: true })
  }, [isSuccess])

  const { handleSubmit, register, formState: { errors }, setFocus } = methods

  useEffect(() => {
    setFocus("role")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateUserInput> = (value) => {
    if (userId) changeRoleUser({ userId, role: value.role })
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              {user
              ? <TextField 
                  {...register("role")} 
                  focused
                  defaultValue={user.role}
                  label="User role" 
                  select
                  error={!!errors.role} 
                  helperText={!!errors.role ? errors.role.message : ""} 
                  fullWidth
                >
                  {userRoles.map(u => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </TextField>
              : <Skeleton height={100} />}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit">Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  )
}


