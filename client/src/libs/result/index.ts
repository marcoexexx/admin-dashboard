import { Err } from ".";
import { Ok } from ".";

export * from "./as_result";
export * from "./err";
export * from "./ok";

export interface ToString {
  toString(): string;
}

class UnwrapException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

class UnreachableException<T extends any> extends Error {
  constructor(variable: T) {
    super(`Unreachable: ${{ variable }}`);
  }
}

export function unwrap_failed<E extends ToString>(
  msg: string,
  err: E,
): never {
  throw new UnwrapException(`${msg}: ${err.toString()}`);
}

export default class Result<T, E extends ToString> {
  constructor(
    public _type: "ok" | "err",
    public value: T | E,
  ) {}

  is_ok(): this is Result<T, never> {
    if (this._type === "ok") return true;
    return false;
  }

  is_err(): this is Result<never, E> {
    if (this._type === "err") return true;
    return false;
  }

  ok(): T | undefined {
    if (this.is_ok()) return this.value;
  }

  err(): E | undefined {
    if (this.is_err()) return this.value;
  }

  expect(msg: string): T {
    if (this.is_ok()) return this.value;
    else if (this.is_err()) unwrap_failed(msg, this.value);
    throw new UnreachableException(this.value);
  }

  unwrap(): T {
    if (this.is_ok()) return this.value;
    else if (this.is_err()) {
      unwrap_failed(
        "called `Result::unwrap()` on an `Err` value",
        this.value as E,
      );
    }
    throw new UnreachableException(this.value);
  }

  map<U extends ToString>(op: (x: T) => U): Result<U, E> {
    if (this.is_ok()) return Ok(op(this.value));
    else if (this.is_err()) return Err(this.value);
    throw new UnreachableException(this.value);
  }

  map_or<U>(def: U, f: (x: T) => U): U {
    if (this.is_ok()) return f(this.value);
    else if (this.is_err()) return def;
    throw new UnreachableException(this.value);
  }

  map_or_else<U>(def: (err: E) => U, f: (x: T) => U): U {
    if (this.is_ok()) return f(this.value);
    else if (this.is_err()) return def(this.value);
    throw new UnreachableException(this.value);
  }

  map_err<U extends ToString>(op: (err: E) => U): Result<T, U> {
    if (this.is_ok()) return Ok(this.value);
    else if (this.is_err()) return Err(op(this.value));
    throw new UnreachableException(this.value);
  }

  and<U extends ToString>(res: Result<U, E>): Result<U, E> {
    if (this.is_ok()) return res;
    else if (this.is_err()) return Err(this.value);
    throw new UnreachableException(this.value);
  }

  and_then<U extends ToString>(op: (x: T) => Result<U, E>): Result<U, E> {
    if (this.is_ok()) return op(this.value);
    else if (this.is_err()) return Err(this.value);
    throw new UnreachableException(this.value);
  }

  or<U extends ToString>(res: Result<T, U>): Result<T, U> {
    if (this.is_ok()) return Ok(this.value);
    else if (this.is_err()) return res;
    throw new UnreachableException(this.value);
  }

  or_else<U extends ToString>(op: (err: E) => Result<T, U>): Result<T, U> {
    if (this.is_ok()) return Ok(this.value);
    else if (this.is_err()) return op(this.value);
    throw new UnreachableException(this.value);
  }

  expect_err(msg: string): E {
    if (this.is_ok()) {
      unwrap_failed(
        msg,
        (this.value ?? "undefined value") as typeof this.value & ToString,
      );
    } else if (this.is_err()) return this.value;
    throw new UnreachableException(this.value);
  }

  unwrap_err(): E {
    if (this.is_ok()) {
      unwrap_failed(
        "called `Result::unwrap_err()` on an `Ok` value",
        (this.value ?? "undefined value") as typeof this.value & ToString,
      );
    } else if (this.is_err()) return this.value;
    throw new UnreachableException(this.value);
  }

  unwrap_or(def: T): T {
    if (this.is_ok()) return this.value;
    else if (this.is_err()) return def;
    throw new UnreachableException(this.value);
  }

  ok_or_throw(): T {
    if (this.is_ok()) return this.value;
    throw this.value;
  }
}
