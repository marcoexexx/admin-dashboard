import { EnhancedTable, TypedColumn } from "@/components";
import { RenderShopownerLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { Exchange, Resource } from "@/services/types";
import { Box, Card, Divider, TablePagination, Typography } from "@mui/material";
import { ExchangesFilterForm } from ".";

const columns: TypedColumn<Exchange>[] = [
  {
    id: "to",
    align: "left",
    name: "To",
    render: ({ value }) => <Typography>{value.to}</Typography>,
  },
  {
    id: "from",
    align: "left",
    name: "From",
    render: ({ value }) => <Typography>{value.from}</Typography>,
  },
  {
    id: "rate",
    align: "left",
    name: "Rate",
    render: ({ value }) => <Typography>{value.rate}</Typography>,
  },
  {
    id: "date",
    align: "right",
    name: "Date",
    render: ({ value }) => <Typography>{new Date(value.date).toUTCString()}</Typography>,
  },
  {
    id: "shopowner",
    align: "right",
    name: "Shopowner",
    render: ({ value }) =>
      value.shopowner ? <RenderShopownerLabel shopowner={value.shopowner} /> : null,
  },
];

interface ExchangesListTableProps {
  exchanges: Exchange[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function ExchangesListTable(props: ExchangesListTableProps) {
  const { exchanges, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props;
  const { state: { exchangeFilter: { pagination } }, dispatch } = useStore();

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_EXCHANGE_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_EXCHANGE_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Exchange]}
        renderFilterForm={<ExchangesFilterForm />}
        rows={exchanges}
        resource={Resource.Exchange}
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
