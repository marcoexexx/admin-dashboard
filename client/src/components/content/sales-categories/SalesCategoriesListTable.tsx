import { EnhancedTable, TypedColumn } from "@/components";
import { RenderCountLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { Resource, SalesCategory } from "@/services/types";
import { Box, Card, Divider, TablePagination, Typography } from "@mui/material";
import { SalesCategorysFilterForm } from ".";

const columns: TypedColumn<SalesCategory>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <Typography>{value.name}</Typography>,
  },
  {
    id: "startDate",
    align: "left",
    name: "Start date",
    render: ({ value }) => <Typography>{new Date(value.startDate).toUTCString()}</Typography>,
  },
  {
    id: "endDate",
    align: "left",
    name: "End date",
    render: ({ value }) => <Typography>{new Date(value.endDate).toUTCString()}</Typography>,
  },
  {
    id: "isActive",
    align: "left",
    name: "Sttus",
    render: ({ value }) => <Typography>{value.isActive ? "Active" : "Out of date"}</Typography>,
  },
  {
    id: "_count",
    align: "left",
    name: "Count",
    render: ({ value }) => <RenderCountLabel _count={value._count} />,
  },
];

interface SalesCategoriesListTableProps {
  salesCategoiries: SalesCategory[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function SalesCategoriesListTable(props: SalesCategoriesListTableProps) {
  const { salesCategoiries, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props;
  const { state: { salesCategoryFilter: { pagination } }, dispatch } = useStore();

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_SALES_CATEGORY_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_SALES_CATEGORY_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.SalesCategory]}
        renderFilterForm={<SalesCategorysFilterForm />}
        rows={salesCategoiries}
        resource={Resource.SalesCategory}
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
