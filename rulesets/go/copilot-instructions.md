# Copilot Instructions — Go

- Follow PROJECT_RULES.md.
- Always use context in request-scoped operations.
- Prefer small interfaces and constructor-based DI.
- Wrap errors with %w and add context.
- Format with gofmt/goimports.
- Add table-driven tests.

- Add GoDoc comments for all exported identifiers so code completion tooltips are helpful.
- For database writes, enforce ACID-friendly transaction boundaries and avoid partial writes.
