import Result, { Err, Ok } from ".";

export function as_result<Args extends any[], ReturnType>(fn: (...args: Args) => ReturnType) {
  return function<E extends Error>(...args: Args): Result<ReturnType, E> {
    try {
      const func = fn(...args);
      return Ok(func);
    } catch (e: any) {
      return Err(e);
    }
  };
}

export function as_result_async<Args extends any[], ReturnType>(fn: (...args: Args) => Promise<ReturnType>) {
  return async function<E extends Error>(...args: Args): Promise<Result<ReturnType, E>> {
    try {
      const func = await fn(...args);
      return Ok(func);
    } catch (e: any) {
      return Err(e);
    }
  };
}
