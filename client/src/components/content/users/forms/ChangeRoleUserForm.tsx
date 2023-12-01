import { Box, Grid, MenuItem, Skeleton, TextField } from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useEffect } from "react";
import { changeRoleUserFn, getUserFn } from "@/services/usersApi";


const userRoles = ["Admin", "User", "Employee"]

const updateUserSchema = object({
  role: z.enum(["User", "Admin", "Employee", "*"], {
    required_error: "Role is required"
  }),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export function ChangeRoleUserForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const navigate = useNavigate()
  const { userId } = useParams()
  const from = "/users/list"

  const { 
    data: user,
    isSuccess: isSuccessFetchUser,
  } = useQuery({
    enabled: !!userId,
    queryKey: ["users", { id: userId }],
    queryFn: args => getUserFn(args, { userId }),
    select: data => data?.user
  })

  const {
    mutate: changeRoleUser,
  } = useMutation({
    mutationFn: changeRoleUserFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success updated a user.",
        severity: "success"
      } })
      if (modalForm.field === "*") navigate(from)
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    if (isSuccessFetchUser && user) methods.setValue("role", "Employee", { shouldValidate: true })
  }, [isSuccessFetchUser])

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


