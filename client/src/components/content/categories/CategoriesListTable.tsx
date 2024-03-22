import { EnhancedTable, TypedColumn } from "@/components";
import { RenderCategoryLabel } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { Category, Resource } from "@/services/types";
import {
  Box,
  Card,
  Divider,
  TablePagination,
  Typography,
} from "@mui/material";
import { CategoriesFilterForm } from ".";

const columns: TypedColumn<Category>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <RenderCategoryLabel category={value} />,
  },
  {
    id: "createdAt",
    align: "left",
    name: "Created At",
    render: ({ value }) => (
      <Typography>{new Date(value.createdAt).toUTCString()}</Typography>
    ),
  },
];

interface CategoriesListTableProps {
  categories: Category[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function CategoriesListTable(props: CategoriesListTableProps) {
  const {
    categories,
    count,
    isLoading,
    onCreateMany,
    onDelete,
    onMultiDelete,
  } = props;
  const { state: { categoryFilter: { pagination } }, dispatch } =
    useStore();

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_CATEGORY_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_CATEGORY_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Category]}
        renderFilterForm={<CategoriesFilterForm />}
        rows={categories}
        resource={Resource.Category}
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
