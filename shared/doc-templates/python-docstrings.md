# Python Docstring Templates

## Public function template (Google-style)
```py
def name(value: str) -> str:
    """<One-line summary of what this does and why it exists.>

    Args:
        value: <Meaning and constraints.>

    Returns:
        <What is returned and any important guarantees.>

    Raises:
        ValueError: <When/why it is raised.>

    Notes:
        - <Important edge case or invariant>
    """
    ...
```

## Public class template
```py
class Name:
    """<What this type represents and its single responsibility.>

    Invariants:
        - <Invariant #1>
        - <Invariant #2>
    """

    def __init__(self, value: str) -> None:
        """<Constructor intent and constraints.>

        Args:
            value: <Meaning and constraints.>
        """
        self.value = value
```

## Notes
- Document **public** modules/classes/functions only.
- Prefer documenting **why/invariants/edge cases**.
- For DB writes, document transaction expectations and partial-write avoidance.
