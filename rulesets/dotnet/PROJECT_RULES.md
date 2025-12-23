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

## Security
- Secrets from config providers / env; never hardcode.
- Enforce authorization policies at endpoints.

## Testing
- Unit tests for services.
- Integration tests for endpoints where appropriate.
