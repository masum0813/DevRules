Copilot / AI Assistant Guidelines — Prevent Duplicate Implementations (Swift)

Purpose:
- Prefer reuse of existing Swift types, extensions, and functions before adding new implementations.

Language-specific guidance:
- Search typical Swift source locations: `Sources/**`, `Modules/**`, `**/*.swift`.
- Prefer using extensions and protocol-oriented adapters to avoid duplication across types.

Rules:
1. Pre-search requirement
- Search for symbols and similar implementations using commands like:
  - `rg "func\s+symbolName|extension\s+TypeName" -- "**/*.swift"`
  - `git grep -n "symbolName" -- "**/*.swift"`

2. If matches found
- Recommend reusing existing types, creating extensions, or small protocol adapters. Provide file links and short excerpts.

3. Generation constraints
- When new public APIs are added, include `///` documentation comments and a small unit test (XCTest) example.

4. Duplicate detection (CI)
- Use `jscpd` where feasible, or language-aware tools; exclude `Carthage/`, `Pods/`, `DerivedData/`.

5. Outputs
- Summary: reuse|adapter|new_impl, matched files/lines, plan, minimal patch with docs/tests.
# Copilot Instructions — Swift

- Follow the rules in PROJECT_RULES.md.
- Prefer Swift concurrency (async/await) over callbacks.
- Avoid force unwrap/try!; handle optionals safely with guard/if let.
- UI updates must be on MainActor.
- For new features: propose file structure (Models/ViewModels/Views/Services).
- Include unit tests for new non-trivial logic.

- Ensure all `public`/`open` APIs include `///` documentation suitable for code completion tooltips
  (summary + params/returns + edge cases).
- If implementing persistence or database writes, ensure ACID-friendly transactional boundaries
  and avoid partial writes.
