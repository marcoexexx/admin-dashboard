import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { PermissionsListTable } from ".";

import { useStore } from "@/hooks";
import { useCreateMultiPermissions, useDeletePermission, useDeleteMultiPermissions, useGetPermissions } from "@/hooks/permission";
import { INITIAL_PAGINATION } from "@/context/store";


export function PermissionsList() {
  const { state: { permissionFilter } } = useStore()

  // Queries
  const { try_data, isLoading } = useGetPermissions({
    filter: permissionFilter.where,
    pagination: permissionFilter.pagination || INITIAL_PAGINATION,
  })

  // Mutations
  const { mutate: createPermissions } = useCreateMultiPermissions()
  const { mutate: deletePermission } = useDeletePermission()
  const { mutate: deletePermissions } = useDeleteMultiPermissions()

  // Extraction
  const data = try_data.ok_or_throw()

  function handleCreateManyPermissions(buf: ArrayBuffer) {
    createPermissions(buf)
  }

  function handleDeletePermission(id: string) {
    deletePermission(id)
  }

  function handleDeleteMultiPermissions(ids: string[]) {
    deletePermissions(ids)
  }


  if (!data || isLoading) return <SuspenseLoader />


  return <Card>
    <PermissionsListTable
      isLoading={isLoading}
      permissions={data.results}
      count={data.count}
      onCreateMany={handleCreateManyPermissions}
      onDelete={handleDeletePermission}
      onMultiDelete={handleDeleteMultiPermissions}
    />
  </Card>
}
