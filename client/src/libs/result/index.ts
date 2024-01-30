export * from './ok'
export * from './err'
export * from './as_result'

export interface ToString {
  toString(): string
}

class UnwrapException extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export function unwrap_failed<E extends ToString>(msg: string, err: E): never {
  throw new UnwrapException(`${msg}: ${err.toString()}`)
}

export default class Result<T, E extends ToString> {
  constructor(
    public _type: "ok" | "err",
    public value: T | E
  ) {}

  is_ok() {
    if  (this._type === "ok") return true
    return false
  }

  is_err() {
    if  (this._type === "err") return true
    return false
  }

  ok(): T | undefined {
    if  (this._type === "err") return this.value as T
  }

  err(): E | undefined {
    if  (this._type === "err") return this.value as E
  }

  expect(msg: string): T {
    if (this._type === "ok") return this.value as T
    unwrap_failed(msg, this.value as E)
  }

  unwrap(): T {
    if (this._type === "ok") return this.value as T
    unwrap_failed("called `Result::unwrap()` on an `Err` value", this.value as E)
  }

  ok_or_throw(): T {
    if (this._type === "ok") return this.value as T
    throw this.value as E
  }
}
