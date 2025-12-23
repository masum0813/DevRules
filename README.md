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

## One-line curl bootstrap (cross-platform)

If you host DevRules on GitHub and want to install it into a target repo without cloning DevRules locally, use the Node-based bootstrap.

From your **target repository root**, run:

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | node - -- --repo .
```

Force overwrite (rules + templates + npm scripts):

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | node - -- --repo . --force
```

Force a specific ruleset:

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | node - -- --repo . --rules python-fastapi
```

Disable Makefile/justfile install:

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | node - -- --repo . --no-makefile --no-justfile
```

Disable package.json script patching:

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | node - -- --repo . --no-npm
```

> Notes:
> - Requires Node.js 18+ (for built-in `fetch`).
> - Replace the URL owner/repo/branch if you fork DevRules.
