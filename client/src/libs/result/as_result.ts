import Result, { Err, Ok, ToString } from ".";

export function as_result<Args extends any[], ReturnType extends ToString>(fn: (...args: Args) => ReturnType) {
  return function<E extends Error>(...args: Args): Result<ReturnType, E> {
    try {
      const func = fn(...args);
      return Ok(func);
    } catch (e: any) {
      return Err(e);
    }
  };
}
