import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { RolesListTable } from ".";
import { useStore } from "@/hooks";
import { useCreateMultiRoles, useDeleteMultiRoles, useDeleteRole, useGetRoles } from "@/hooks/role";
import { INITIAL_PAGINATION } from "@/context/store";


export function RolesList() {
  const { state: { roleFilter } } = useStore()

  // Queries
  const rolesQuery = useGetRoles({
    filter: roleFilter.where,
    pagination: roleFilter.pagination || INITIAL_PAGINATION,
    include: {
      _count: true
    }
  })

  // Mutations
  const createRolesMutation = useCreateMultiRoles()
  const deleteRoleMutation = useDeleteRole()
  const deleteRolesMutation = useDeleteMultiRoles()

  // Extraction
  const data = rolesQuery.try_data.ok_or_throw()

  function handleCreateManyRoles(buf: ArrayBuffer) {
    createRolesMutation.mutate(buf)
  }

  function handleDeleteRole(id: string) {
    deleteRoleMutation.mutate(id)
  }

  function handleDeleteMultiRoles(ids: string[]) {
    deleteRolesMutation.mutate(ids)
  }


  if (!data || rolesQuery.isLoading) return <SuspenseLoader />


  return <Card>
    <RolesListTable
      isLoading={rolesQuery.isLoading}
      roles={data.results}
      count={data.count}
      onCreateMany={handleCreateManyRoles}
      onDelete={handleDeleteRole}
      onMultiDelete={handleDeleteMultiRoles}
    />
  </Card>
}
