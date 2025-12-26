# Copilot Instructions — C#/.NET

- Follow PROJECT_RULES.md.
- Use nullable reference types; avoid null pitfalls.
- Controllers should be thin; place logic in services.
- Prefer async/await; avoid blocking calls.
- Return ProblemDetails for errors.
- Add unit tests for services; integration tests for endpoints where relevant.

- Ensure public APIs include XML doc comments suitable for IntelliSense tooltips.
- For database writes, enforce ACID-friendly transaction boundaries and avoid partial writes.

- Model generation guidance:
	- Map database/query outputs to small POCO model classes (`Column`, `Table`, `StoredProcedure`) and use them in controller responses or application services.
	- Prompt suggestion: "Generate POCO classes for DB metadata (Column, Table) and map query outputs to these models. Put models under `Models/` namespace and add basic helpers like `ToCreateScript()` where applicable." 
