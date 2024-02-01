import isObject from "lodash/isObject";
import mapValues from "lodash/mapValues";

export function convertStringToBoolean<T>(value: T): any {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (isObject(value)) {
    return mapValues(value, convertStringToBoolean);
  } else {
    return value;
  }
}
