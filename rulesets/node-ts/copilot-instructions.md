# Copilot Instructions — Node/TS

- Follow PROJECT_RULES.md.
- Prefer strong types; avoid `any`.
- Validate request payloads and environment variables.
- Use async/await.
- Add/update tests for new logic.
- Do not introduce secrets; use env vars and config schema.

- Add JSDoc for all exported/public APIs so code completion tooltips are informative.
- For database writes, enforce ACID-compliant transactions and avoid partial writes.
- Prefer idempotent write operations when retries are possible.

- Model generation guidance:
	- For query outputs, generate TypeScript models (interfaces/classes) and map rows to constructors.
	- Prompt suggestion: "Convert query result rows into typed model instances (Column, Table, StoredProcedure). Place models in `src/models/` and export types."
