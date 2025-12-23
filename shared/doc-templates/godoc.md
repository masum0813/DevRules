# GoDoc Templates (Go)

## Exported function template
```go
// Name does <one-line summary: what and why>.
//
// Important:
// - <Key edge case or invariant>
// - <Key edge case or invariant>
func Name(ctx context.Context, value string) (Result, error) {
    // ...
}
```

## Exported type template
```go
// Name represents <what it is> and is responsible for <single responsibility>.
//
// Invariants:
// - <Invariant #1>
// - <Invariant #2>
type Name struct {
    // Value is <meaning and constraints>.
    Value string
}
```

## Notes
- Comments for exported identifiers must start with the identifier name (GoDoc convention).
- Document **why/invariants/edge cases**; keep it concise.
- For DB writes, document transaction expectations and idempotency assumptions.
