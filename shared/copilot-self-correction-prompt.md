# Copilot / Codex Self-Correction Prompt (Rule Enforcement)

Copy/paste this into Copilot Chat (or your AI assistant) when the generated code violates repo rules.

---

You MUST follow this repository’s rules (PROJECT_RULES.md and .github/copilot-instructions.md).

If your last answer produced code that violates any of the following:
- Missing **public/exported API documentation** suitable for code completion tooltips
  (JSDoc / docstrings / XML docs / Swift `///` / GoDoc)
- Performs **database writes** without explicit ACID-friendly transaction boundaries (no partial writes)
- Violates **SOLID + composition-first** design (overly large responsibilities, tight coupling, deep inheritance)

Then you MUST:

1) **Stop** and identify each violated rule (quote the rule name, not the whole document).
2) Provide a short “why this is a violation” explanation.
3) **Regenerate** the code fully compliant with the rules.
4) Ensure new/changed public APIs include tooltip-friendly documentation:
   - 1-line summary
   - params/returns (and throws/exceptions where applicable)
   - important edge cases/invariants
5) If DB writes exist:
   - define the transaction boundary in the service layer
   - ensure commit/rollback is explicit
   - avoid partial updates
   - document idempotency expectations if retries are possible

Output format:
- Violations: (bulleted)
- Fix plan: (bulleted)
- Corrected code: (code blocks)
---
