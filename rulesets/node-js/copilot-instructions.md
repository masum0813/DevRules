Copilot / AI Assistant Guidelines — Prevent Duplicate Implementations (Node.js)

Purpose:
- Prefer reuse of existing code in the repo before generating new Node/JavaScript code.

Language-specific guidance:
- Search file patterns typical for Node projects: `src/**`, `lib/**`, `**/*.js`, `**/*.mjs`, `**/*.cjs`.
- When suggesting package/tooling changes, prefer `npm`/`pnpm` workflows and include `package.json` script examples.

Rules:
1. Pre-search requirement
- Before producing code, run text search for similar symbols and code snippets. Example:
  - `git grep -n "symbolName" -- "src/**"`
  - `rg "symbolName" src lib --hidden`

2. If matches found
- Recommend reuse (file path + excerpt), propose adapter/wrapper, or explain why new implementation needed.

3. Generation constraints
- If you must create new code, include a short justification and a minimal unit test (e.g., Jest) or usage example.

4. Duplicate detection (CI)
- Use `jscpd` for JS/TS duplication checks. Configure globs to exclude `node_modules`, `dist`, and generated files.

5. Outputs
- Summary: reuse|adapter|new_impl, matched files, brief plan, minimal patch.

Notes for maintainers: tune `jscpd` thresholds and exclude vendor/generated folders.
# Copilot Instructions — Node/JS

- Follow PROJECT_RULES.md.
- Use JSDoc for all exported/public APIs.
- Validate request payloads and environment variables.
- Use async/await.
- Add/update tests for new logic.
- Do not introduce secrets; use env vars and config schema.

- For database writes, enforce ACID-compliant transactions and avoid partial writes.
- Prefer idempotent write operations when retries are possible.

# Model generation guidance
- When queries return complex rows, generate model classes and map outputs to them in routers.
- Prompt: "Map query results to model constructors (Column, Table, StoredProcedure). Add helper methods and validations. Place models in `src/models/`."
