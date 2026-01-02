Copilot / AI Assistant Guidelines — Prevent Duplicate Implementations (.NET)

Purpose:
- Prefer reuse of existing assemblies/types and methods before adding new implementations in .NET projects.

Language-specific guidance:
- Search C# files and projects: `**/*.cs`, `src/**`, `*/**/*.csproj`.
- Prefer extracting shared logic into a new internal/public helper when duplication appears.

Rules:
1. Pre-search requirement
- Search for symbols and types using:
  - `git grep -n "ClassName" -- "**/*.cs"`
  - `rg "methodName" -g "**/*.cs"`

2. If matches found
- Recommend reuse or adapter (internal wrapper), or explain incompatibilities that justify a new impl.

3. Generation constraints
- Include XML doc comments and an xUnit/NUnit test example when adding public behavior.

4. Duplicate detection (CI)
- Use PMD/CPD for duplication detection across .NET codebases or adapt `jscpd` if preferred. Exclude `bin/`, `obj/`, `generated/`.

5. Outputs
- Summary, matched files/lines, refactor plan, minimal patch with docs and tests.
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
