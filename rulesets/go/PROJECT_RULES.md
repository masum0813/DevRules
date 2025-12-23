# Project Rules — Go

## Goals
- Idiomatic Go, small interfaces, clear errors, fast builds.

## Engineering Best Practices
- **Design:** Apply SOLID intent where appropriate; prefer composition and small interfaces.
- **Public API documentation (Tooltip-friendly):** Exported identifiers MUST include GoDoc comments
  (starting with the identifier name) so IDE tooltips are informative.
  - Include: concise summary, non-obvious parameters/returns, and important edge cases.
- **Data integrity (ACID / DB writes):** If the project performs database writes,
  multi-step writes MUST be executed within explicit transactions.

## See also
- GoDoc templates: ../../shared/doc-templates/godoc.md
- ACID violation checklist (DB writes): ../../shared/acid-violation-checklist.md
- Copilot self-correction prompt: ../../shared/copilot-self-correction-prompt.md

## Style
- gofmt required; goimports for imports.
- Wrap errors with context using `%w`.

## Structure
- Prefer `/internal` for non-public packages.
- Avoid global state; pass dependencies via constructors.

## Concurrency
- Use context for cancellation/timeouts.
- Prevent goroutine leaks; close channels properly.

## Testing
- Table-driven tests.
- Mock external dependencies via small interfaces.

## Tooling
- golangci-lint baseline: staticcheck, govet, errcheck, ineffassign.
