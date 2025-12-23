# XML Documentation Templates (.NET / C#)

## Public method template
```csharp
/// <summary>
/// <One-line summary of what this does and why it exists.>
/// </summary>
/// <param name="value"><What this parameter means and constraints.></param>
/// <returns><What is returned and any important guarantees.></returns>
/// <exception cref="ArgumentOutOfRangeException"><When/why it is thrown.</exception>
public ReturnType Name(Type value)
{
    // ...
}
```

## Public type template
```csharp
/// <summary>
/// <What this type represents and its single responsibility.>
/// </summary>
/// <remarks>
/// Invariants:
/// - <Invariant #1>
/// - <Invariant #2>
/// </remarks>
public sealed class Name
{
    /// <summary><Meaning and constraints.></summary>
    public string Value { get; }

    /// <summary><Constructor intent.></summary>
    /// <param name="value"><Meaning and constraints.</param>
    public Name(string value) => Value = value;
}
```

## Notes
- Document **public** members only.
- Prefer documenting **why / invariants / edge cases**.
- For APIs that write to DB, document transaction expectations and idempotency.
