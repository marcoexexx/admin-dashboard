import { Box, Card, Divider, TablePagination, Typography } from "@mui/material"
import { RegionsFilterForm } from ".";
import { RenderTownshipName } from "@/components/table-labels";
import { EnhancedTable, TypedColumn } from "@/components";
import { Region, Resource } from "@/services/types";
import { CacheResource } from "@/context/cacheKey";
import { useStore } from "@/hooks";


const columns: TypedColumn<Region>[] = [
  {
    id: "name",
    align: "left",
    name: "Name",
    render: ({ value }) => <Typography>{value.name}</Typography>
  },
  {
    id: "townships",
    align: "left",
    name: "Townships",
    render: ({ value }) => <>{value.townships?.map(township => <RenderTownshipName key={township.id} township={township} />)}</>
  }
]


interface RegionsListTableProps {
  regions: Region[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyRegions: (buf: ArrayBuffer) => void
}

export function RegionsListTable(props: RegionsListTableProps) {
  const { regions, count, isLoading, onCreateManyRegions, onDelete, onMultiDelete } = props
  const { state: { regionFilter }, dispatch } = useStore()

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_REGION_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_REGION_FILTER", payload: { limit: parseInt(evt.target.value, 10) }
    })
  }


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
        onMultiCreate={onCreateManyRegions}
      />

      <Divider />

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={regionFilter?.page
            ? regionFilter.page - 1
            : 0}
          rowsPerPage={regionFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  )
}
