import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { Exchange, Resource } from "@/services/types";
import { EnhancedTable, TypedColumn } from "@/components";
import { ExchangesFilterForm } from ".";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";
import { INITIAL_PAGINATION } from "@/context/store";


const columns: TypedColumn<Exchange>[] = [
  {
    id: "to",
    align: "left",
    name: "To",
    render: ({ value }) => <Typography>{value.to}</Typography>
  },
  {
    id: "from",
    align: "left",
    name: "From",
    render: ({ value }) => <Typography>{value.from}</Typography>
  },
  {
    id: "rate",
    align: "left",
    name: "Rate",
    render: ({ value }) => <Typography>{value.rate}</Typography>
  },
  {
    id: "date",
    align: "right",
    name: "Date",
    render: ({ value }) => <Typography>{new Date(value.date).toUTCString()}</Typography>
  },
]

interface ExchangesListTableProps {
  exchanges: Exchange[]
  count: number
  onDelete: (id: string) => void
  isLoading?: boolean
  onMultiDelete: (ids: string[]) => void
  onCreateManyExchanges: (buf: ArrayBuffer) => void
}

export function ExchangesListTable(props: ExchangesListTableProps) {
  const { exchanges, count, isLoading, onCreateManyExchanges, onDelete, onMultiDelete } = props
  const { state: { exchangeFilter: { pagination } }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_EXCHANGE_PAGE",
      payload: page += 1
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_EXCHANGE_PAGE_SIZE",
      payload: parseInt(evt.target.value, 10)
    })
  }


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
        onMultiCreate={onCreateManyExchanges}
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
