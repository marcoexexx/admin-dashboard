import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { Resource, ShopownerProvider } from "@/services/types";
import { EnhancedTable, TypedColumn } from "@/components";
import { ShopownersFilterForm } from ".";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<ShopownerProvider>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <Typography>{value.name}</Typography>
  },
  // {
  //   id: "remark",
  //   align: "left",
  //   name: "Remark",
  //   render: ({ value }) => <Typography>{value.remark}</Typography>
  // },
  {
    id: "createdAt",
    align: "left",
    name: "Created At",
    render: ({ value }) => <Typography>{new Date(value.createdAt).toUTCString()}</Typography>
  },
]


interface ShopownersListTableProps {
  shopowners: ShopownerProvider[]
  count: number
  isLoading?: boolean
  onDelete?: (id: string) => void
  onMultiDelete?: (ids: string[]) => void
  onCreateMany?: (buf: ArrayBuffer) => void
}

export function ShopownersListTable(props: ShopownersListTableProps) {
  const { shopowners, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props
  const { state: { shopownerFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_SHOPOWNER_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_SHOPOWNER_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }

  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Brand]}
        renderFilterForm={<ShopownersFilterForm />}
        rows={shopowners}
        resource={Resource.Shopowner}
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
