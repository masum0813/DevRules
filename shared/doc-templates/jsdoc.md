# JSDoc Templates (TypeScript / JavaScript)

## Public function template
```ts
/**
 * <One-line summary of what this does and why it exists.>
 *
 * @param <name> <What the parameter means (not just the type).>
 * @returns <What is returned and any important guarantees.>
 * @throws <ErrorType> <When/why it is thrown.>
 *
 * @example
 * <Short usage example (optional for critical APIs)>
 */
export function name(param: Type): ReturnType {
  // ...
}
```

## Public class template
```ts
/**
 * <One-line summary: what this class represents and its responsibility.>
 *
 * Invariants:
 * - <Important invariant #1>
 * - <Important invariant #2>
 */
export class Name {
  /** <What this property represents and any constraints.> */
  public readonly value: string;

  /**
   * <One-line summary of the constructor intent.>
   * @param value <Meaning and constraints.>
   */
  constructor(value: string) {
    this.value = value;
  }
}
```

## Notes
- Document **public/exported** API surface only.
- Prefer documenting **why/invariants/edge cases**, not restating obvious code.
- If a function is retryable or used in DB writes, document idempotency expectations.
