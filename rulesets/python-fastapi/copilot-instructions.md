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
