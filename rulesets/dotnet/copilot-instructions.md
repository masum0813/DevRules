# Copilot Instructions — C#/.NET

- Follow PROJECT_RULES.md.
- Use nullable reference types; avoid null pitfalls.
- Controllers should be thin; place logic in services.
- Prefer async/await; avoid blocking calls.
- Return ProblemDetails for errors.
- Add unit tests for services; integration tests for endpoints where relevant.

- Ensure public APIs include XML doc comments suitable for IntelliSense tooltips.
- For database writes, enforce ACID-friendly transaction boundaries and avoid partial writes.
