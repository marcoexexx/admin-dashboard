import * as XLSX from "xlsx";

export function parseExcel(buf: Buffer) {
  const wb = XLSX.read(buf, { type: "buffer" });

  const sheet = wb.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);

  return data;
}
