import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { Permission, Resource } from "@/services/types";
import { EnhancedTable, TypedColumn } from "@/components";
import { PermissionsFilterForm } from ".";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<Permission>[] = [
  {
    id: "resource",
    align: "left",
    name: "Resource",
    render: ({ value }) => <Typography>{value.resource}</Typography>
  },
  {
    id: "action",
    align: "left",
    name: "Action",
    render: ({ value }) => <Typography>{value.action}</Typography>
  },
]


interface PermissionsListTableProps {
  permissions: Permission[]
  count: number
  isLoading?: boolean
  onDelete?: (id: string) => void
  onMultiDelete?: (ids: string[]) => void
  onCreateMany?: (buf: ArrayBuffer) => void
}

export function PermissionsListTable(props: PermissionsListTableProps) {
  const { permissions, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props
  const { state: { permissionFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_PERMISSION_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_PERMISSION_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Permission]}
        renderFilterForm={<PermissionsFilterForm />}
        rows={permissions}
        resource={Resource.Permission}
        isLoading={isLoading}
        columns={columns}
        onSingleDelete={onDelete}
        onMultiDelete={onMultiDelete}
        onMultiCreate={onCreateMany}
      />

      <Divider />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={pagination?.page
            ? pagination.page - 1
            : 0}
          rowsPerPage={pagination?.pageSize || INITIAL_PAGINATION.pageSize}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

    </Card>
  )
}
