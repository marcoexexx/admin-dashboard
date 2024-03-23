import { Card } from "@mui/material";
import { PermissionsListTable } from ".";

import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import {
  useCreateMultiPermissions,
  useDeleteMultiPermissions,
  useDeletePermission,
  useGetPermissions,
} from "@/hooks/permission";

export function PermissionsList() {
  const { state: { permissionFilter } } = useStore();

  // Queries
  const { try_data, isLoading } = useGetPermissions({
    filter: permissionFilter.where,
    pagination: permissionFilter.pagination || INITIAL_PAGINATION,
  });

  // Mutations
  const { mutate: createPermissions } = useCreateMultiPermissions();
  const { mutate: deletePermission } = useDeletePermission();
  const { mutate: deletePermissions } = useDeleteMultiPermissions();

  // Extraction
  const data = try_data.ok_or_throw();

  function handleCreateManyPermissions(buf: ArrayBuffer) {
    createPermissions(buf);
  }

  function handleDeletePermission(id: string) {
    deletePermission(id);
  }

  function handleDeleteMultiPermissions(ids: string[]) {
    deletePermissions(ids);
  }

  return (
    <Card>
      <PermissionsListTable
        isLoading={isLoading}
        permissions={data?.results ?? []}
        count={data?.count ?? 0}
        onCreateMany={handleCreateManyPermissions}
        onDelete={handleDeletePermission}
        onMultiDelete={handleDeleteMultiPermissions}
      />
    </Card>
  );
}
