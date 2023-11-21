export type Pagination = {
  page?: number,
  pageSize?: number
}

export type FilterNumberic = {
  gt?: number,
  gte?: number,
  lt?: number,
  lte?: number,
  equals?: number,
  in?: number[],
  not?: number,
  notIn?: number[]
}

export type FilterStringy = {
  equals?: string,
  in?: string[],
  not?: string,
  notIn?: string[],
  contains?: string[],
  startsWith?: string,
  endsWith?: string,
  mode?: "insensitive" | "default"
}
