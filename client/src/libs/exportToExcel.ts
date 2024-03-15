import * as XLSX from "xlsx";

export function exportToExcel<T>(rows: T[], title: string) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  const name = `${title}_${Date.now()}`;

  XLSX.utils.book_append_sheet(wb, ws, name);
  XLSX.writeFile(wb, name + ".xlsx");
}

export async function convertToExcel<T>(rows: T[], title: string): Promise<ArrayBuffer> {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  const name = `${title}_${Date.now()}`;

  XLSX.utils.book_append_sheet(wb, ws, name);
  return await XLSX.write(wb, { bookType: "xlsx", type: "array" });
}
