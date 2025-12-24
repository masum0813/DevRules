# DevRules (Central Rulesets)

This folder is your single source of truth for project rules + VS Code settings.

## Doc comment templates (Tooltip-friendly)

These templates help ensure public/exported APIs always show clear information in IDE code-completion tooltips.

- TypeScript / JavaScript (JSDoc): `shared/doc-templates/jsdoc.md`
- C# / .NET (XML Docs): `shared/doc-templates/dotnet-xml-docs.md`
- Swift (Xcode Quick Help): `shared/doc-templates/swift-doc-comments.md`
- Go (GoDoc): `shared/doc-templates/godoc.md`
- Python (Docstrings): `shared/doc-templates/python-docstrings.md`

## ACID violation checklist (DB write mandatory)

If a project performs database writes, these checks define what counts as an ACID/transaction boundary violation:

- `shared/acid-violation-checklist.md`

## Copilot self-correction prompt

If Copilot/Codex generates code that violates project rules (public API docs, DB transaction boundaries, SOLID/composition),
use this prompt as a standard “regenerate correctly” instruction:

- `shared/copilot-self-correction-prompt.md`

## Doc comment templates (Tooltip-friendly)

These templates help ensure public/exported APIs always show clear information in IDE code-completion tooltips.

- TypeScript / JavaScript (JSDoc): `shared/doc-templates/jsdoc.md`
- C# / .NET (XML Docs): `shared/doc-templates/dotnet-xml-docs.md`
- Swift (Xcode Quick Help): `shared/doc-templates/swift-doc-comments.md`
- Go (GoDoc): `shared/doc-templates/godoc.md`
- Python (Docstrings): `shared/doc-templates/python-docstrings.md`

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
- node-js
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

### Multiple rulesets (monorepos)

Apply more than one ruleset by repeating `--rules` or providing comma-separated values, optionally scoped to a subdirectory with `@subdir`:

```bash
node /path/to/DevRules/tools/install-to-repo.mjs \
  --rules node-ts@apps/frontend \
  --rules python-fastapi@services/api

# Equivalent single flag
node /path/to/DevRules/tools/install-to-repo.mjs --rules node-ts@apps/frontend,python-fastapi@services/api
```

Each `@subdir` is resolved relative to `--repo` (default `.`). When omitted, the ruleset applies to the root of `--repo`.

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

Multiple rulesets in one pass:

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | \
  node - -- --repo . --rules node-ts@apps/frontend --rules python-fastapi@services/api
```

You can also comma-separate the `--rules` flag if you prefer a single argument:

```bash
curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | \
  node - -- --repo . --rules node-ts@apps/frontend,python-fastapi@services/api
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

## Best Practices (applied by rulesets)

The following engineering principles are enforced through the rulesets and Copilot instructions:

- **Design:** SOLID principles with a composition-first approach (avoid deep inheritance).
- **Documentation (Public only):** All public/exported APIs must include tooltip-friendly documentation
  (JSDoc, docstrings, XML docs, Swift `///`, GoDoc).
- **Code Completion Friendly:** Documentation must be written so IDE code completion tooltips clearly
  explain intent, parameters, return values, and important edge cases.
- **Data Integrity:** If a project performs database writes, **ACID-compliant transactional boundaries**
  are mandatory (no partial writes).
