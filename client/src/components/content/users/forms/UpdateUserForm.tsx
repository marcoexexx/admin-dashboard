import { Box, Grid } from "@mui/material";
import { MuiButton } from "@/components/ui";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { RoleInputField, ShopownerInputField } from "@/components/input-fields";
import { FormModal } from "@/components/forms";
import { CreateRoleForm } from "../../roles/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, z } from "zod";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetUser, useUpdateUser } from "@/hooks/user";
import { useStore } from "@/hooks";
import { CreateShopownerForm } from "../../shopowners/forms";


const updateUserSchema = object({
  roleId: string().optional(),
  shopownerProviderId: string().optional()
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export function UpdateUserForm() {
  const { userId } = useParams()
  const { state: { modalForm } } = useStore()

  // Queries
  const userQuery = useGetUser({
    id: userId,
  })

  // Mutations
  const { mutate: updateUser, isPending } = useUpdateUser()

  // Extraction
  const user = userQuery.try_data.ok_or_throw()
  const userFetchStatus = userQuery.fetchStatus

  const methods = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    if (userQuery.isSuccess && user && userFetchStatus === "idle") {
      if (user.roleId) methods.setValue("roleId", user.roleId)
      if (user.shopownerProviderId) methods.setValue("shopownerProviderId", user.shopownerProviderId)
    }
  }, [userQuery.isSuccess, userFetchStatus])


  const { handleSubmit, setFocus } = methods

  useEffect(() => {
    setFocus("roleId")
  }, [setFocus])

  const onSubmit: SubmitHandler<UpdateUserInput> = (value) => {
    if (userId) updateUser({ id: userId, payload: value })
  }

  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <RoleInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }}>
              <ShopownerInputField updateField />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <MuiButton variant="contained" type="submit" loading={isPending}>Save</MuiButton>
          </Grid>
        </Grid>
      </FormProvider>

      {modalForm.field === "create-role"
        ? <FormModal field='create-role' title='Create new role'>
          <CreateRoleForm />
        </FormModal>
        : null}

      {modalForm.field === "create-shopowner"
        ? <FormModal field='create-shopowner' title='Create new role'>
          <CreateShopownerForm />
        </FormModal>
        : null}
    </>
  )
}


