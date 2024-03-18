import { DynamicColumn, EnhancedTable, TypedColumn } from "@/components";
import { RenderResourceItemLabel, RenderUsernameLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { AuditLog, Resource } from "@/services/types";
import { Box, Card, TablePagination, Typography } from "@mui/material";

const typedCols: TypedColumn<AuditLog>[] = [
  {
    id: "user",
    align: "left",
    name: "User",
    render: ({ value, me }) => value.user && me ? <RenderUsernameLabel user={value.user} me={me} /> : null,
  },
  {
    id: "resource",
    align: "left",
    name: "Resource",
    render: ({ value }) => <Typography>{value.resource}</Typography>,
  },
  {
    id: "action",
    align: "left",
    name: "Action",
    render: ({ value }) => <Typography>{value.action}</Typography>,
  },
  {
    id: "resourceIds",
    align: "left",
    name: "Resource items",
    render: ({ value }) => (
      <>{value.resourceIds.map(id => <RenderResourceItemLabel key={id} id={id} resource={value.resource} />)}</>
    ),
  },
];
const dynamicCols: DynamicColumn<AuditLog>[] = [
  {
    id: "role",
    align: "left",
    name: "Role",
    render: ({ value }) => <Typography>{value.user?.role?.name}</Typography>,
  },
];
const columns = [...typedCols, ...dynamicCols];

interface AuditLogsListTableProps {
  auditLogs: AuditLog[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function AuditLogsListTable(props: AuditLogsListTableProps) {
  const { auditLogs, count, isLoading, onDelete, onMultiDelete, onCreateMany } = props;
  const { state: { auditLogFilter: { pagination } }, dispatch } = useStore();

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_AUDIT_LOG_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_AUDIT_LOG_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        hideCheckbox
        hideTopActions
        refreshKey={[CacheResource.AuditLog]}
        rows={auditLogs}
        resource={Resource.AuditLog}
        isLoading={isLoading}
        columns={columns}
        onSingleDelete={onDelete}
        onMultiDelete={onMultiDelete}
        onMultiCreate={onCreateMany}
      />

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
