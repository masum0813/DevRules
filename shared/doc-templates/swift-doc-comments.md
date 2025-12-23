# Swift Doc Comment Templates (Xcode Quick Help)

## Public function template
```swift
/// <One-line summary of what this does and why it exists.>
///
/// - Parameters:
///   - value: <Meaning and constraints.>
/// - Returns: <Return meaning and guarantees.>
/// - Throws: <When/why errors are thrown.>
public func name(value: Type) throws -> ReturnType {
    // ...
}
```

## Public type template
```swift
/// <What this type represents and its single responsibility.>
///
/// - Important: <Critical note that callers must know.>
/// - Invariant: <Invariant #1>
public struct Name {
    /// <Meaning and constraints.>
    public let value: String

    /// <Constructor intent and constraints.>
    public init(value: String) {
        self.value = value
    }
}
```

## Notes
- Document **public/open** API surface only.
- Prefer documenting **why / invariants / edge cases**, not obvious implementation details.
- For persistence writes, document atomicity expectations (all-or-nothing).
