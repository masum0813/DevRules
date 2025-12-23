# Project Rules — Go

## Goals
- Idiomatic Go, small interfaces, clear errors, fast builds.

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
