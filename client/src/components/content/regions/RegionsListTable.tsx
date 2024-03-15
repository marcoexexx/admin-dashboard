import { EnhancedTable, TypedColumn } from "@/components";
import { RenderTownshipName } from "@/components/table-labels";
import { CacheResource } from "@/context/cacheKey";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { Region, Resource } from "@/services/types";
import { Box, Card, Divider, TablePagination, Typography } from "@mui/material";
import { RegionsFilterForm } from ".";

const columns: TypedColumn<Region>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <Typography>{value.name}</Typography>,
  },
  {
    id: "townships",
    align: "left",
    name: "Townships",
    render: ({ value }) => (
      <>{value.townships?.map(township => <RenderTownshipName key={township.id} township={township} />)}</>
    ),
  },
];

interface RegionsListTableProps {
  regions: Region[];
  count: number;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onMultiDelete?: (ids: string[]) => void;
  onCreateMany?: (buf: ArrayBuffer) => void;
}

export function RegionsListTable(props: RegionsListTableProps) {
  const { regions, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props;
  const { state: { regionFilter: { pagination } }, dispatch } = useStore();

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_REGION_PAGE",
      payload: page += 1,
    });
  };

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_REGION_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10),
    });
  };

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Region]}
        renderFilterForm={<RegionsFilterForm />}
        rows={regions}
        resource={Resource.Region}
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
