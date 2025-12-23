# DevRules (Central Rulesets)

This folder is your single source of truth for project rules + VS Code settings.

## What it provides
- `rulesets/<name>/PROJECT_RULES.md`
- `rulesets/<name>/copilot-instructions.md` -> copied into repo as `.github/copilot-instructions.md`
- `shared/vscode.settings.base.json` -> common settings + language blocks
- `shared/.editorconfig`

## Apply to a repo (copy mode)
From your target repository:

```bash
node ~/DevRules/tools/apply-rules.mjs
```

Force overwrite:

```bash
node ~/DevRules/tools/apply-rules.mjs --force
```

## Supported rulesets
- swift
- node-ts
- python-fastapi
- go
- dotnet

## Optional helpers (per repo)
Copy one of these into your repo root:
- `templates/Makefile`
- `templates/justfile`

For npm/yarn/pnpm repos, see `templates/npm-scripts.md`.

## One-command install (recommended)
From your target repository root, run:

```bash
node /path/to/DevRules/tools/install-to-repo.mjs
```

Force overwrite (rules + templates + npm scripts):

```bash
node /path/to/DevRules/tools/install-to-repo.mjs --force
```

Disable template copying:

```bash
node /path/to/DevRules/tools/install-to-repo.mjs --no-makefile --no-justfile
```

Disable package.json script patching:

```bash
node /path/to/DevRules/tools/install-to-repo.mjs --no-npm
```
