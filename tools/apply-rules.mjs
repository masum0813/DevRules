\
#!/usr/bin/env node
/**
 * DevRules — Apply Rules (copy mode)
 *
 * Usage:
 *   node tools/apply-rules.mjs            # detect ruleset from current repo
 *   node tools/apply-rules.mjs --rules go # force a ruleset
 *   node tools/apply-rules.mjs --repo /path/to/repo
 *   node tools/apply-rules.mjs --force    # overwrite existing files
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const __dirname = new URL(".", import.meta.url).pathname;

function parseArgs(argv) {
  const args = { repo: process.cwd(), rules: null, force: false, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--repo") args.repo = argv[++i];
    else if (a === "--rules") args.rules = argv[++i];
    else if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "-h" || a === "--help") args.help = true;
  }
  return args;
}

function exists(p) {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

// shallow merge + one-level deep merge for objects
function mergeDeep(a, b) {
  const out = { ...(a ?? {}) };
  for (const [k, v] of Object.entries(b ?? {})) {
    if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) {
      out[k] = { ...out[k], ...v };
    } else {
      out[k] = v;
    }
  }
  return out;
}

function detectRuleset(repo) {
  const has = (...rel) => exists(path.join(repo, ...rel));

  // Go
  if (has("go.mod")) return "go";

  // .NET
  const entries = safeReaddir(repo);
  if (entries.some(f => f.endsWith(".sln") || f.endsWith(".csproj"))) return "dotnet";

  // Swift
  if (has("Package.swift") || entries.some(f => f.endsWith(".xcodeproj"))) return "swift";
  if (walkHasExt(repo, ".swift", 2)) return "swift";

  // Node/TS
  if (has("package.json")) {
    if (has("tsconfig.json") || walkHasExt(repo, ".ts", 2) || walkHasExt(repo, ".tsx", 2)) return "node-ts";
    // still node, but default to node-ts ruleset (works fine for JS too)
    return "node-ts";
  }

  // Python/FastAPI
  if (has("pyproject.toml") || has("requirements.txt") || has("poetry.lock")) return "python-fastapi";

  return null;
}

function safeReaddir(dir) {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function walkHasExt(root, ext, maxDepth = 2) {
  function walk(dir, depth) {
    if (depth > maxDepth) return false;
    let items;
    try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return false; }
    for (const it of items) {
      if (it.name === "node_modules" || it.name === ".git" || it.name === ".venv") continue;
      const p = path.join(dir, it.name);
      if (it.isFile() && it.name.endsWith(ext)) return true;
      if (it.isDirectory() && walk(p, depth + 1)) return true;
    }
    return false;
  }
  return walk(root, 0);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest, force, dryRun) {
  if (exists(dest) && !force) {
    console.log(`SKIP  (exists): ${dest}`);
    return;
  }
  if (dryRun) {
    console.log(`COPY  ${src} -> ${dest}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`COPIED: ${dest}`);
}

function writeJSON(dest, obj, force, dryRun) {
  if (exists(dest) && !force) {
    console.log(`SKIP  (exists): ${dest}`);
    return;
  }
  if (dryRun) {
    console.log(`WRITE ${dest}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`WROTE : ${dest}`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log("Usage: node tools/apply-rules.mjs [--repo PATH] [--rules NAME] [--force] [--dry-run]");
    process.exit(0);
  }

  const repo = path.resolve(args.repo);
  const rules = args.rules ?? detectRuleset(repo);
  if (!rules) {
    console.error("Could not detect a ruleset. Use --rules {swift|node-ts|python-fastapi|go|dotnet}");
    process.exit(2);
  }

  const root = path.resolve(path.join(__dirname, ".."));
  const baseSettingsPath = path.join(root, "shared", "vscode.settings.base.json");
  const rulesetDir = path.join(root, "rulesets", rules);

  if (!exists(rulesetDir)) {
    console.error(`Ruleset not found: ${rulesetDir}`);
    process.exit(2);
  }

  // Copy text rules
  copyFile(path.join(rulesetDir, "PROJECT_RULES.md"), path.join(repo, "PROJECT_RULES.md"), args.force, args.dryRun);
  copyFile(path.join(rulesetDir, "copilot-instructions.md"), path.join(repo, ".github", "copilot-instructions.md"), args.force, args.dryRun);

  // EditorConfig (shared)
  copyFile(path.join(root, "shared", ".editorconfig"), path.join(repo, ".editorconfig"), args.force, args.dryRun);

  // Merge VS Code settings: base + ruleset override
  const base = readJSON(baseSettingsPath);
  const override = readJSON(path.join(rulesetDir, "vscode.settings.json"));
  const merged = mergeDeep(base, override);

  // Special merge for nested objects we care about
  if (base["editor.codeActionsOnSave"] || override["editor.codeActionsOnSave"]) {
    merged["editor.codeActionsOnSave"] = mergeDeep(base["editor.codeActionsOnSave"] ?? {}, override["editor.codeActionsOnSave"] ?? {});
  }

  // Merge any [lang] blocks if overridden
  for (const k of Object.keys(override)) {
    if (k.startsWith("[") && k.endsWith("]")) {
      merged[k] = mergeDeep(base[k] ?? {}, override[k] ?? {});
    }
  }

  writeJSON(path.join(repo, ".vscode", "settings.json"), merged, args.force, args.dryRun);

  console.log(`\nDone. Applied ruleset: ${rules}`);
}

main();
