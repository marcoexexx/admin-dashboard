import _ from "lodash";

export const convertNumericStrings = <T extends object>(
  obj: T,
): Record<keyof T, any> => {
  return _.mapValues(obj, (value) => {
    if (_.isObject(value)) {
      return convertNumericStrings(value); // Recursively convert nested objects
    } else if (_.isString(value) && _.isNumber(_.toNumber(value))) {
      const result = _.toNumber(value);
      return Number.isNaN(result) ? value : _.toNumber(value); // Convert numeric strings to numbers
    } else {
      return value;
    }
  });
};
