# Project Rules — Swift (iOS/macOS)

## Goals
- Write safe, readable, testable Swift code.
- Prefer modern Swift concurrency and SwiftUI where applicable.

## Engineering Best Practices
- **Design:** Apply SOLID where applicable; prefer composition over inheritance; keep responsibilities small.
- **Public API documentation (Tooltip-friendly):** All `public`/`open` types, methods, and properties MUST have
  `///` doc comments visible in Xcode Quick Help.
  - Include: 1-line summary, parameter descriptions, return value (if any), and important edge cases.
- **Data integrity (ACID / DB writes):** If this project performs database or persistent writes,
  write operations MUST be transactional with explicit commit/rollback boundaries.

## See also
- Swift doc comment templates (Xcode Quick Help): ../../shared/doc-templates/swift-doc-comments.md
- ACID violation checklist (DB writes): ../../shared/acid-violation-checklist.md
- Copilot self-correction prompt: ../../shared/copilot-self-correction-prompt.md

## Language & Style
- Swift 5.9+ (or current toolchain used by the repo).
- Follow Swift API Design Guidelines.
- Prefer `let` over `var` whenever possible.
- Avoid force unwrap (`!`) and `try!` in production code.
- Use explicit access control intentionally.

## Architecture
- Keep UI and business logic separated.
- Prefer MVVM (SwiftUI) / clean boundaries.
- Networking behind a dedicated client/service layer.
- Prefer dependency injection over singletons.

## Concurrency
- Prefer `async/await`.
- UI updates must be on `MainActor`.

## Error Handling
- Use typed errors (`enum`) where meaningful.
- Do not swallow errors; log or propagate with context.

## Testing
- Add/maintain unit tests for business logic.
- Keep tests deterministic; no real network calls (mock/stub).

## Security
- Never commit secrets (tokens, API keys).
- Use Keychain for sensitive data; avoid secrets in UserDefaults.
