import Result, { ToString } from ".";

export const Ok = <T extends ToString>(value: T) => new Result<T, never>("ok", value)

