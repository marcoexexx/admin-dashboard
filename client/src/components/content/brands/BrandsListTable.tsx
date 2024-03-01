import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { Brand, Resource } from "@/services/types";
import { EnhancedTable, TypedColumn } from "@/components";
import { BrandsFilterForm } from ".";
import { CacheResource } from "@/context/cacheKey";
import { RenderBrandLabel } from "@/components/table-labels";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<Brand>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <RenderBrandLabel brand={value} />
  },
  {
    id: "createdAt",
    align: "left",
    name: "Created At",
    render: ({ value }) => <Typography>{new Date(value.createdAt).toUTCString()}</Typography>
  },
]


interface BrandsListTableProps {
  brands: Brand[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateMany: (buf: ArrayBuffer) => void
}

export function BrandsListTable(props: BrandsListTableProps) {
  const { brands, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props
  const { state: { brandFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_BRAND_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_BRAND_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Brand]}
        renderFilterForm={<BrandsFilterForm />}
        rows={brands}
        resource={Resource.Brand}
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
