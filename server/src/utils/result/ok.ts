import Result from ".";

export const Ok = <T>(value: T) => new Result<T, never>("ok", value)

