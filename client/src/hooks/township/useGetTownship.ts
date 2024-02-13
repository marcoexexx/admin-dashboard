import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { TownshipFilter } from "@/context/township";
import { useQuery } from "@tanstack/react-query";
import { getTownshipFn } from "@/services/TownshipsApi";


export function useGetTownship({
  id,
  include,
}: {
  id: string | undefined,
  include?: TownshipFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["townships", { id, include }],
    queryFn: args => getTownshipFn(args, { townshipId: id, include }),
    select: data => data?.township
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

