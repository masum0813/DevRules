Copilot / AI Assistant Guidelines — Prevent Duplicate Implementations (Go)

Purpose:
- Prefer reuse of existing Go packages and functions before adding new implementations.

Language-specific guidance:
- Search typical Go patterns: packages under `./...`, `cmd/**`, `pkg/**`, `internal/**`.
- Use `go vet`/`golangci-lint` conventions when suggesting code changes.

Rules:
1. Pre-search requirement
- Run searches such as:
  - `rg "func\s+SymbolName" -g '!vendor'`
  - `git grep -n "SymbolName" -- ':/**/*.go'`

2. If matches found
- Prefer calling existing package functions, or propose a small wrapper in the same package.

3. Generation constraints
- If a new function is required, document concurrency/side-effect behavior and include a `_test.go` example.

4. Duplicate detection (CI)
- Use `dupl` for Go duplication detection (`go install github.com/mibk/dupl@latest`). Tune `-threshold`.

5. Outputs
- Summary: reuse|adapter|new_impl, matched files and lines, plan, minimal patch with tests.
# Copilot Instructions — Go

- Follow PROJECT_RULES.md.
- Always use context in request-scoped operations.
- Prefer small interfaces and constructor-based DI.
- Wrap errors with %w and add context.
- Format with gofmt/goimports.
- Add table-driven tests.

- Add GoDoc comments for all exported identifiers so code completion tooltips are helpful.
- For database writes, enforce ACID-friendly transaction boundaries and avoid partial writes.
