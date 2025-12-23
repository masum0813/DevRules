# Project Rules — C# / .NET

## Goals
- Clean boundaries, safe async, consistent APIs, strong DI.

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
