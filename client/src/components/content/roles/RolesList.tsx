import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import {
  useCreateMultiRoles,
  useDeleteMultiRoles,
  useDeleteRole,
  useGetRoles,
} from "@/hooks/role";
import { Card } from "@mui/material";
import { RolesListTable } from ".";

export function RolesList() {
  const { state: { roleFilter } } = useStore();

  // Queries
  const rolesQuery = useGetRoles({
    filter: roleFilter.where,
    pagination: roleFilter.pagination || INITIAL_PAGINATION,
    include: {
      _count: true,
    },
  });

  // Mutations
  const createRolesMutation = useCreateMultiRoles();
  const deleteRoleMutation = useDeleteRole();
  const deleteRolesMutation = useDeleteMultiRoles();

  // Extraction
  const data = rolesQuery.try_data.ok_or_throw();

  function handleCreateManyRoles(buf: ArrayBuffer) {
    createRolesMutation.mutate(buf);
  }

  function handleDeleteRole(id: string) {
    deleteRoleMutation.mutate(id);
  }

  function handleDeleteMultiRoles(ids: string[]) {
    deleteRolesMutation.mutate(ids);
  }

  return (
    <Card>
      <RolesListTable
        isLoading={rolesQuery.isLoading}
        roles={data?.results ?? []}
        count={data?.count ?? 0}
        onCreateMany={handleCreateManyRoles}
        onDelete={handleDeleteRole}
        onMultiDelete={handleDeleteMultiRoles}
      />
    </Card>
  );
}
