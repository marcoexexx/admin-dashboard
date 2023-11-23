export function applyFilters<T extends { status: Status }, F extends { status: Status }>(
  rows: Array<T>,
  filters: F
) {
  return rows.filter(row => {
    let matches = true
    if (filters.status && row.status !== filters.status) {
      matches = false
    }
    return matches
  })
}
