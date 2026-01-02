Copilot / AI Assistant Guidelines — Prevent Duplicate Implementations (Node + TypeScript)

Purpose:
- Prefer reuse of existing TypeScript code in the repo before generating new implementations.

Language-specific guidance:
- Search TypeScript file patterns: `src/**`, `packages/**`, `**/*.ts`, `**/*.tsx`.
- Prefer small adapter functions and keep type definitions consistent with existing types.

Rules:
1. Pre-search requirement
- Run text/semantic searches for matching symbols and types. Examples:
  - `git grep -n "symbolName" -- "src/**"`
  - `rg "symbolName" src packages --hidden`

2. If matches found
- Recommend reuse/adapter, or provide a short migration/refactor plan if types differ.

3. Generation constraints
- Provide TypeScript types, minimal `ts-jest` or `vitest` unit test, and update exported type if necessary.

4. Duplicate detection (CI)
- Use `jscpd` for duplication detection; exclude `node_modules`, `dist`, and generated proto files.

5. Outputs
- Summary, matched files, plan, and minimal patch including type changes if needed.
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
