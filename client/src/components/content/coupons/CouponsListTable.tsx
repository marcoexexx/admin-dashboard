import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { EnhancedTable, TypedColumn } from "@/components";
import { CouponsFilterForm } from ".";
import { RenderProductLabel } from "@/components/table-labels";
import { Coupon, Resource } from "@/services/types";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<Coupon>[] = [
  {
    id: "label",
    align: "left",
    name: "Label",
    render: ({ value }) => <Typography>{value.label}</Typography>
  },
  {
    id: "points",
    align: "left",
    name: "Points",
    render: ({ value }) => <Typography>{value.points}</Typography>
  },
  {
    id: "dolla",
    align: "left",
    name: "Dolla",
    render: ({ value }) => <Typography>{value.dolla}</Typography>
  },
  {
    id: "product",
    align: "left",
    name: "Product",
    render: ({ value }) => value.product ? <RenderProductLabel product={value.product} /> : null
  },
  {
    id: "isUsed",
    align: "right",
    name: "Used",
    render: ({ value }) => <Typography>{value.isUsed ? "Used" : "Unused"}</Typography>
  },
]


interface CouponsListTableProps {
  coupons: Coupon[]
  count: number
  isLoading?: boolean
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateMany: (buf: ArrayBuffer) => void
}

export function CouponsListTable(props: CouponsListTableProps) {
  const { coupons, count, isLoading, onCreateMany, onDelete, onMultiDelete } = props
  const { state: { couponFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_COUPON_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_COUPON_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }


  return (
    <Card>
      <EnhancedTable
        refreshKey={[CacheResource.Coupon]}
        renderFilterForm={<CouponsFilterForm />}
        rows={coupons}
        resource={Resource.Coupon}
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
