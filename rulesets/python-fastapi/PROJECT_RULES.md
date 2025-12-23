# Project Rules — Python / FastAPI

## Goals
- Clean, typed Python; predictable APIs; safe dependency management.

## Style & Tooling
- Use type hints broadly; keep code mypy/pyright-friendly.
- Lint with ruff; format with black (or ruff-format if the repo uses it).
- Avoid mutable default args.

## FastAPI Practices
- Use Pydantic models for request/response.
- Keep routers thin; business logic in services.
- Use `Depends()` for auth/db/config injection.
- Consistent error schema; no leaking internal exceptions.

## Structure
- routers/, schemas/, services/, repositories/, core/

## Security
- Secrets via env/secret manager only.
- Strict CORS.
- Enforce authz per route.

## Testing
- pytest.
- Test routers with TestClient; mock external deps.
