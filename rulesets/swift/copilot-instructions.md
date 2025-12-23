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
