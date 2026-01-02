Copilot / AI Assistant Guidelines — Prevent Duplicate Implementations

Purpose:
- Before generating new code, prefer reuse of existing code in the repository. This guideline instructs the assistant to search, reference, and reuse or adapt existing implementations instead of re-implementing equivalent logic.

Rules:
1. Pre-search requirement
- Before producing code, search the workspace for similar symbols (function/method names, classes, types, and properties) and for similar algorithmic logic.
- Use simple text searches first (example commands shown below). If available, prefer semantic/embedding-based search and return the best matches.

2. What to return when matches are found
- If an existing implementation matches the requested behavior, do NOT rewrite it. Instead:
  - Recommend reusing the existing symbol (show file path and short excerpt), or
  - Propose a minimal adapter/wrapper that calls the existing implementation, or
  - If reuse is impossible, clearly explain why (compatibility, wrong API shape, side-effects) and list required changes to make it reusable.
- Always include file links and function/class names for reviewers to inspect.

3. When generating new implementation
- Include a short justification (1–2 sentences) explaining why a new implementation is necessary (e.g., performance, different side-effects, new signature).
- Mark the new code with a brief “reason for new impl” comment.

4. Naming and reuse guidance
- Prefer adding small helpers or adapters that delegate to existing functions rather than duplicating core logic.
- If the new code duplicates >20% of an existing implementation, prefer refactoring the existing code into a shared function and show a refactor plan.

5. Documentation and tests
- When you introduce new public behavior, include a short docstring/JSDoc and a simple unit test or usage example referencing the repository’s testing conventions.

6. Outputs and format
- When suggesting code, always output:
  - A one-line summary (reuse / adapter / new implementation)
  - Matched file paths with line ranges
  - A short plan (reuse path or refactor steps)
  - The minimal code patch (diff-style or single-file snippet)

7. Developer prompts (examples)
- "Before writing code, search the repo for similar functions or types matching `<symbol>` using `git grep -n` or `rg`. If found, recommend reuse and provide file links; otherwise produce a minimal adapter or justify a new impl."
- "If you find matches, return: reuse|adapter|new_impl, file:line, short reason, patch."

8. Tools & commands (examples for maintainers)
- Text search (fast, deterministic):
  - `git grep -n "symbolName"`
  - `rg "symbolName" --hidden`
- Semantic search (if available): search via code-embedding service (e.g., Sourcegraph, OpenAI embeddings) and return top 3 matches.
- Duplicate detection (CI): jscpd, dupl, CPD (configure thresholds, see CI examples later).

9. Reviewer checklist (for PR authors)
- Link to potential existing implementations included? (Yes/No)
- Chosen path: reuse / adapter / new implementation
- Justification for new code included (if applicable)

10. Tone & constraints for the assistant
- Be conservative: prefer reuse when reasonable.
- Keep generated code minimal and well-documented.
- When uncertain, ask a clarifying question rather than assuming.

Example short workflow (for authors & assistants):
1. Assistant: run quick repo search for similar symbols (insert top 3 matches). If nothing found, ask clarifying question about intent.
2. Assistant: propose reuse/adapter/refactor plan where appropriate.
3. Assistant: provide minimal patch or usage example and include tests/docs.

Notes for maintainers:
- This file is intended to be copied into the target repository as `.github/copilot-instructions.md` when applying rulesets.
- Tweak thresholds and repository search defaults per language and repo size.
# Copilot Instructions — Python/FastAPI

- Follow PROJECT_RULES.md.
- Use Pydantic models for all request/response bodies.
- Keep routers thin; put logic into services.
- Use Depends() for db/auth/config.
- Add type hints.
- Add pytest tests for new endpoints and service logic.

- Ensure public functions/classes/modules include clear docstrings visible in code completion tooltips.
- For database writes, enforce ACID-friendly transaction boundaries and avoid partial writes.

- Model generation guidance:
	- When queries return metadata rows, generate Pydantic models (e.g., `Column`, `Table`) and map query outputs to them in routers/services.
	- Prompt suggestion: "Map raw DB rows to Pydantic models (Column, Table, StoredProcedure). Place models in `app/models.py` or `app/models/` and use them in router responses."
