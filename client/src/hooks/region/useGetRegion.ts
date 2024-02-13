import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { RegionFilter } from "@/context/region";
import { getRegionFn } from "@/services/regionsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetRegion({
  id,
  include,
}: {
  id: string | undefined,
  include?: RegionFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["regions", { id, include }],
    queryFn: args => getRegionFn(args, { regionId: id, include }),
    select: data => data?.region
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

