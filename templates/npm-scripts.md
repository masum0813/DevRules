## NPM script snippet (add to your repo's package.json)

```json
{
  "scripts": {
    "devrules": "node ~/DevRules/tools/apply-rules.mjs --repo .",
    "devrules:force": "node ~/DevRules/tools/apply-rules.mjs --repo . --force",
    "devrules:dry": "node ~/DevRules/tools/apply-rules.mjs --repo . --dry-run"
  }
}
```

> Tip: If you want a repo-local path instead of `~/DevRules`, set an env var and use it in the command.
