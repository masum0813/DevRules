# Project Rules — C# / .NET

## Goals
- Clean boundaries, safe async, consistent APIs, strong DI.

## Engineering Best Practices
- **Design:** Apply SOLID where applicable; prefer composition over inheritance; keep responsibilities small.
- **Public API documentation (Tooltip-friendly):** Public APIs MUST include XML documentation comments
  (`/// <summary>...</summary>`) so IntelliSense tooltips explain intent.
  - Include: `<summary>`, `<param>`, `<returns>`, `<exception>` (if relevant), and important edge cases.
- **Data integrity (ACID / DB writes):** If the project performs database writes,
  multi-step writes MUST be executed within explicit transactions with clear commit/rollback boundaries.

## See also
- .NET XML doc templates: ../../shared/doc-templates/dotnet-xml-docs.md
- ACID violation checklist (DB writes): ../../shared/acid-violation-checklist.md
- Copilot self-correction prompt: ../../shared/copilot-self-correction-prompt.md

## Style
- Enable nullable reference types.
- Avoid `async void` (except event handlers).
- Prefer async/await end-to-end; avoid blocking calls.

## Architecture
- Controllers thin: validation + call service/application layer.
- Business logic in services; data access behind repositories/DbContext.
- Use DI; no ServiceLocator.

## Errors & API
- Use ProblemDetails for Web APIs.
- Do not expose internal exception details to clients.

## Models (Query outputs)
- Map raw query results to small POCO model classes (`Column`, `Table`, `StoredProcedure`) instead of returning unstructured rows.
- Benefits: centralized parsing/validation, helper methods (e.g., `ToCreateScript()`), clearer controller responses, and easier unit testing.
- Minimal pattern (C#): place models under `Models/` and map query outputs in services (`rows.Select(r => new Table(...))`).

## Security
- Secrets from config providers / env; never hardcode.
- Enforce authorization policies at endpoints.

## Testing
- Unit tests for services.
- Integration tests for endpoints where appropriate.
