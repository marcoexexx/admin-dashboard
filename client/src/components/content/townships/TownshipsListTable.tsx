import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { EnhancedTable, TypedColumn } from "@/components";
import { RenderRegionLabel } from "@/components/table-labels";
import { Resource, TownshipFees } from "@/services/types";
import { TownshipsFilterForm } from ".";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { numberFormat } from "@/libs/numberFormat";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<TownshipFees>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <Typography>{value.name}</Typography>
  },
  {
    id: "fees",
    align: "left",
    name: "Fees",
    render: ({ value }) => <Typography>{numberFormat(value.fees)}</Typography>
  },
  {
    id: "region",
    align: "left",
    name: "Region",
    render: ({ value }) => value.region ? <RenderRegionLabel region={value.region} /> : null
  }
]


interface TownshipsListTableProps {
  townships: TownshipFees[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateMany: (buf: ArrayBuffer) => void
}

export function TownshipsListTable(props: TownshipsListTableProps) {
  const { townships, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props
  const { state: { townshipFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_TOWNSHIP_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_TOWNSHIP_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }


  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Township]}
        renderFilterForm={<TownshipsFilterForm />}
        rows={townships}
        resource={Resource.Township}
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
