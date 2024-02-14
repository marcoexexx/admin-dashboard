import { Card } from "@mui/material";
import { SuspenseLoader } from "@/components";
import { TownshipsListTable } from ".";
import { useStore } from "@/hooks";
import { useCreateMultiTownships, useDeleteMultiTownships, useDeleteTownship, useGetTownships } from "@/hooks/township";


export function TownshipsList() {
  const { state: {townshipFilter} } = useStore()

  // Quries
  const { try_data, isLoading } = useGetTownships({
    filter: townshipFilter?.fields,
    pagination: {
      page: townshipFilter?.page || 1,
      pageSize: townshipFilter?.limit || 10
    },
    include: {
      region: true
    }
  })

  // Mutations
  const { mutate: createTownships } = useCreateMultiTownships()
  const { mutate: deleteTownship } = useDeleteTownship()
  const { mutate: deleteTownships } = useDeleteMultiTownships()

  // Extraction
  const townships = try_data.ok_or_throw()

  function handleCreateManyTownships(buf: ArrayBuffer) {
    createTownships(buf)
  }

  function handleDeleteTownship(id: string) {
    deleteTownship(id)
  }

  function handleDeleteMultiTownships(ids: string[]) {
    deleteTownships(ids)
  }


  if (!townships || isLoading) return <SuspenseLoader />

  return <Card>
    <TownshipsListTable
      isLoading={isLoading}
      townships={townships.results} 
      count={townships.count} 
      onCreateManyTownships={handleCreateManyTownships} 
      onDelete={handleDeleteTownship}
      onMultiDelete={handleDeleteMultiTownships}
    />
  </Card>
}
