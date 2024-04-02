export type Error = String;

export type Option<T> = Some<T> | None;

export class Some<T> {
  constructor(public readonly value: T) {}

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_: T): T {
    return this.value;
  }

  map<U>(mapper: (value: T) => U): Option<U> {
    return new Some(mapper(this.value));
  }
}

export class None {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  unwrap(): never {
    throw new Error("Called unwrap() on a None value");
  }

  unwrapOr<U>(defaultValue: U): U {
    return defaultValue;
  }

  map<U>(_: (value: any) => U): Option<U> {
    return this;
  }
}
