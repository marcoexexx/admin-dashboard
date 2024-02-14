import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { RegionsListTable } from ".";
import { useStore } from "@/hooks";
import { useCreateMultiRegions, useDeleteMultiRegions, useDeleteRegion, useGetRegions } from "@/hooks/region";


export function RegionsList() {
  const { state: {regionFilter} } = useStore()

  // Queries
  const { try_data, isLoading } = useGetRegions({
    filter: regionFilter?.fields,
    pagination: {
      page: regionFilter?.page || 1,
      pageSize: regionFilter?.limit || 10
    },
    include: {
      townships: true
    }
  })

  // Mutations
  const { mutate: createRegions } = useCreateMultiRegions()
  const { mutate: deleteRegion } = useDeleteRegion()
  const { mutate: deleteRegions } = useDeleteMultiRegions()

  // Extraction
  const regions = try_data.ok_or_throw()

  function handleCreateManyRegions(buf: ArrayBuffer) {
    createRegions(buf)
  }

  function handleDeleteRegion(id: string) {
    deleteRegion(id)
  }

  function handleDeleteMultiRegions(ids: string[]) {
    deleteRegions(ids)
  }


  if (!regions || isLoading) return <SuspenseLoader />

  return <Card>
    <RegionsListTable
      isLoading={isLoading}
      regions={regions.results} 
      count={regions.count} 
      onCreateManyRegions={handleCreateManyRegions} 
      onDelete={handleDeleteRegion}
      onMultiDelete={handleDeleteMultiRegions}
    />
  </Card>
}
