import { EnhancedTable, TypedColumn } from "@/components";
import { RenderOrderItemLabel, RenderUsernameLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { numberFormat } from "@/libs/numberFormat";
import { PotentialOrder, PotentialOrderStatus, Resource } from "@/services/types";
import {
  Box,
  Card,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { PotentialOrdersFilterForm } from ".";

const potentialOrderStatus: {
  label: PotentialOrderStatus;
  color: (theme: Theme) => string;
}[] = [
  {
    label: PotentialOrderStatus.Processing,
    color: (theme) => theme.colors.warning.main,
  },
  {
    label: PotentialOrderStatus.Confimed,
    color: (theme) => theme.colors.success.main,
  },
  {
    label: PotentialOrderStatus.Cancelled,
    color: (theme) => theme.colors.error.main,
  },
];

const columns: TypedColumn<PotentialOrder>[] = [
  {
    id: "user",
    align: "left",
    name: "Username",
    render: ({ value, me }) => value.user && me ? <RenderUsernameLabel user={value.user} me={me} /> : null,
  },
  {
    id: "totalPrice",
    align: "left",
    name: "Amount",
    render: ({ value }) => <Typography>{numberFormat(value.totalPrice)}</Typography>,
  },
  {
    id: "orderItems",
    align: "left",
    name: "Order No",
    render: ({ value }) => <>{value.orderItems?.map(item => <RenderOrderItemLabel key={item.id} orderItem={item} />)}
    </>,
  },
  {
    id: "createdAt",
    align: "left",
    name: "Created",
    render: ({ value }) => <Typography>{new Date(value.createdAt).toUTCString()}</Typography>,
  },
  {
    id: "updatedAt",
    align: "left",
    name: "Updated",
    render: ({ value }) => <Typography>{new Date(value.updatedAt).toUTCString()}</Typography>,
  },
  {
    id: "remark",
    align: "left",
    name: "Remark",
    render: ({ value }) => <Typography>{value.remark}</Typography>,
  },
];

interface PotentialOrdersListTableProps {
  potentialOrders: PotentialOrder[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function PotentialOrdersListTable(props: PotentialOrdersListTableProps) {
  const { potentialOrders, count, isLoading, onDelete, onMultiDelete, onCreateMany } = props;
  const { state: { potentialOrderFilter: { pagination } }, dispatch } = useStore();

  const theme = useTheme();

  const handleChangeOrderStatus = (order: PotentialOrder) => (evt: SelectChangeEvent) => {
    const { value } = evt.target;
    if (value) console.warn("Not supported yet!", order);
  };

  const columnsWithEditableStatus = useMemo(() =>
    columns.concat([
      {
        id: "status",
        align: "left",
        name: "Order status",
        render: ({ value }) => (
          <Select
            labelId="order-status"
            value={value.status}
            onChange={handleChangeOrderStatus(value)}
            size="small"
          >
            {potentialOrderStatus.map(status => {
              return (
                <MenuItem
                  key={status.label}
                  value={status.label}
                >
                  <Typography color={status.color(theme)}>{status.label}</Typography>
                </MenuItem>
              );
            })}
          </Select>
        ),
      },
    ]), []);

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_POTENTIAL_ORDER_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_POTENTIAL_ORDER_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable<PotentialOrder>
        refreshKey={[CacheResource.PotentialOrder]}
        renderFilterForm={<PotentialOrdersFilterForm />}
        rows={potentialOrders}
        resource={Resource.PotentialOrder}
        isLoading={isLoading}
        columns={columnsWithEditableStatus}
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
