// import multer from "multer";

import { excelUploder } from ".";

// export const excelUploadPath = `${__dirname}/../../public/upload/excels`

// export const uploadExcel = multer({
//   dest: excelUploadPath
// }).single("excel")

export const uploadExcel = excelUploder.single("excel");
