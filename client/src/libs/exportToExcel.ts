import * as XLSX from 'xlsx'

export function exportToExcelProducts(products: IProduct[]) {
  const ws = XLSX.utils.json_to_sheet(products)
  const wb = XLSX.utils.book_new()

  const name = `Products_${Date.now()}`

  XLSX.utils.book_append_sheet(wb, ws, name)
  XLSX.writeFile(wb, name + ".xlsx")
}

export function exportToExcelBrands(brands: IBrand[]) {
  const ws = XLSX.utils.json_to_sheet(brands)
  const wb = XLSX.utils.book_new()

  const name = `Brands_${Date.now()}`

  XLSX.utils.book_append_sheet(wb, ws, name)
  XLSX.writeFile(wb, name + ".xlsx")
}
