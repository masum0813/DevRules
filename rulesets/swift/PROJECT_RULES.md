# Project Rules — Swift (iOS/macOS)

## Goals
- Write safe, readable, testable Swift code.
- Prefer modern Swift concurrency and SwiftUI where applicable.

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
