import { as_result } from "../as_result";

export const tryJSONParse = as_result(JSON.parse);
export const tryJSONStringify = as_result(JSON.stringify);

export const tryParseInt = as_result(parseInt);
