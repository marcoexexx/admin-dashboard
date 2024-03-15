import { EnhancedTable, TypedColumn } from "@/components";
import { RenderCountLabel, RenderRoleLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { Resource, Role } from "@/services/types";
import { Box, Card, Divider, TablePagination, Typography } from "@mui/material";
import { RolesFilterForm } from ".";

const columns: TypedColumn<Role>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <RenderRoleLabel role={value} />,
  },
  {
    id: "permissions",
    align: "left",
    name: "Permissions",
    render: ({ value }) => value._count ? <RenderCountLabel _count={value._count} /> : null,
  },
  {
    id: "createdAt",
    align: "left",
    name: "Created At",
    render: ({ value }) => <Typography>{new Date(value.createdAt).toUTCString()}</Typography>,
  },
];

interface RolesListTableProps {
  roles: Role[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function RolesListTable(props: RolesListTableProps) {
  const { roles, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props;
  const { state: { roleFilter: { pagination } }, dispatch } = useStore();

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_ROLE_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_ROLE_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Role]}
        renderFilterForm={<RolesFilterForm />}
        rows={roles}
        resource={Resource.Role}
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
  );
}
