import { SuspenseLoader } from "@/components";
import { INITIAL_PAGINATION } from "@/context/store";
import { useStore } from "@/hooks";
import { useCreateMultiRegions, useDeleteMultiRegions, useDeleteRegion, useGetRegions } from "@/hooks/region";
import { Card } from "@mui/material";
import { RegionsListTable } from ".";

export function RegionsList() {
  const { state: { regionFilter } } = useStore();

  // Queries
  const { try_data, isLoading } = useGetRegions({
    filter: regionFilter.where,
    pagination: regionFilter.pagination || INITIAL_PAGINATION,
    include: {
      townships: true,
    },
  });

  // Mutations
  const { mutate: createRegions } = useCreateMultiRegions();
  const { mutate: deleteRegion } = useDeleteRegion();
  const { mutate: deleteRegions } = useDeleteMultiRegions();

  // Extraction
  const regions = try_data.ok_or_throw();

  function handleCreateManyRegions(buf: ArrayBuffer) {
    createRegions(buf);
  }

  function handleDeleteRegion(id: string) {
    deleteRegion(id);
  }

  function handleDeleteMultiRegions(ids: string[]) {
    deleteRegions(ids);
  }

  if (!regions || isLoading) return <SuspenseLoader />;

  return (
    <Card>
      <RegionsListTable
        isLoading={isLoading}
        regions={regions.results}
        count={regions.count}
        onCreateMany={handleCreateManyRegions}
        onDelete={handleDeleteRegion}
        onMultiDelete={handleDeleteMultiRegions}
      />
    </Card>
  );
}
