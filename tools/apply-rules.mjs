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

  // Node
  if (has("package.json")) {
    if (has("tsconfig.json") || walkHasExt(repo, ".ts", 2) || walkHasExt(repo, ".tsx", 2)) return "node-ts";
    return "node-js";
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

function log(action, detail) {
  const time = new Date().toISOString();
  console.log(`[DevRules] ${time} | ${action} | ${detail}`);
}

function copyFile(src, dest, force, dryRun) {
  if (exists(dest) && !force) {
    log("skip", `exists: ${dest}`);
    return;
  }
  if (dryRun) {
    log("dry-run", `would copy: ${src} -> ${dest}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  log("copy", dest);
}

function smartCopy(src, dest, force, dryRun) {
  const textExts = new Set(['.md', '.txt', '.ini', '.editorconfig', '.gitignore', '.yml', '.yaml', '.env', '.instructions', '.py', '.js', '.ts', '.cs']);
  const ext = path.extname(dest).toLowerCase();

  if (!exists(dest)) {
    return copyFile(src, dest, force, dryRun);
  }

  if (force) {
    return copyFile(src, dest, force, dryRun);
  }

  // If both JSON, merge
  if (ext === '.json') {
    try {
      const srcObj = readJSON(src);
      let destObj = {};
      try { destObj = readJSON(dest); } catch {}
      const mergedObj = mergeDeep(destObj, srcObj);
      // preserve special nested merges
      if (destObj['editor.codeActionsOnSave'] || srcObj['editor.codeActionsOnSave']) {
        mergedObj['editor.codeActionsOnSave'] = mergeDeep(destObj['editor.codeActionsOnSave'] ?? {}, srcObj['editor.codeActionsOnSave'] ?? {});
      }
      for (const k of Object.keys(srcObj)) {
        if (k.startsWith('[') && k.endsWith(']')) {
          mergedObj[k] = mergeDeep(destObj[k] ?? {}, srcObj[k] ?? {});
        }
      }
      return writeJSON(dest, mergedObj, true, dryRun);
    } catch (e) {
      log('warn', `json-merge-failed for ${dest}: ${e.message}`);
      return;
    }
  }

  // Append patterns for gitignore or other plain text files
  if (textExts.has(ext) || path.basename(dest) === '.gitignore' || path.basename(dest).endsWith('PROJECT_RULES.md') || path.basename(dest).endsWith('copilot-instructions.md')) {
    return appendUniqueFile(src, dest, dryRun);
  }

  // Default: skip to avoid overwriting code/binary files
  log('skip', `destination exists, not overwriting: ${dest}`);
}

function appendUniqueFile(src, dest, dryRun) {
  const srcText = fs.readFileSync(src, "utf-8");
  let destText = "";
  try { destText = fs.readFileSync(dest, "utf-8"); } catch { destText = ""; }

  const normalize = (s) => s.replace(/[\r\n]+$/, "");
  const srcLines = srcText.split(/\r?\n/).map(l => normalize(l));
  const destLinesSet = new Set(destText.split(/\r?\n/).map(l => normalize(l)));

  const toAppend = [];
  for (const line of srcLines) {
    if (line.trim() === "") {
      // avoid appending duplicate consecutive blank lines
      if (toAppend.length === 0) {
        const destEndsBlank = destText.endsWith("\n\n") || destText.trim() === "";
        if (!destEndsBlank) toAppend.push(line);
      } else {
        if (toAppend[toAppend.length - 1].trim() !== "") toAppend.push(line);
      }
    } else if (!destLinesSet.has(line)) {
      toAppend.push(line);
    }
  }

  if (toAppend.length === 0) {
    log("skip", `no new patterns for: ${dest}`);
    return;
  }

  if (dryRun) {
    log("dry-run", `would append from ${src} -> ${dest}`);
    toAppend.forEach(l => console.log(`    + ${l}`));
    return;
  }

  ensureDir(path.dirname(dest));
  const prefix = destText === "" || destText.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(dest, prefix + toAppend.join("\n") + "\n", "utf-8");
  log("append", dest);
}

function writeJSON(dest, obj, force, dryRun) {
  if (exists(dest) && !force) {
    log("skip", `exists: ${dest}`);
    return;
  }
  if (dryRun) {
    log("dry-run", `would write: ${dest}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  log("write", dest);
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
    console.error("Could not detect a ruleset. Use --rules {swift|node-js|node-ts|python-fastapi|go|dotnet}");
    process.exit(2);
  }

  const root = path.resolve(path.join(__dirname, ".."));
  const baseSettingsPath = path.join(root, "shared", "vscode.settings.base.json");
  const rulesetDir = path.join(root, "rulesets", rules);

  if (!exists(rulesetDir)) {
    console.error(`Ruleset not found: ${rulesetDir}`);
    process.exit(2);
  }

  // Copy text rules (smart copy: merge/append when possible)
  smartCopy(path.join(rulesetDir, "PROJECT_RULES.md"), path.join(repo, "PROJECT_RULES.md"), args.force, args.dryRun);
  smartCopy(path.join(rulesetDir, "copilot-instructions.md"), path.join(repo, ".github", "copilot-instructions.md"), args.force, args.dryRun);

  // Copy ruleset .gitignore if present (language/framework-specific ignore patterns)
  if (exists(path.join(rulesetDir, ".gitignore"))) {
    smartCopy(path.join(rulesetDir, ".gitignore"), path.join(repo, ".gitignore"), args.force, args.dryRun);
  }

  // EditorConfig (shared)
  smartCopy(path.join(root, "shared", ".editorconfig"), path.join(repo, ".editorconfig"), args.force, args.dryRun);

  // Copy ruleset templates if present (to templates/devrules/<rules>/)
  const templatesDir = path.join(rulesetDir, "templates");
  if (exists(templatesDir)) {
    const destTemplates = path.join(repo, "templates", "devrules", rules);
    // recursively copy files
    function copyDir(srcDir, dstDir) {
      const items = safeReaddir(srcDir);
      for (const it of items) {
        const srcPath = path.join(srcDir, it);
        const dstPath = path.join(dstDir, it);
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
          copyDir(srcPath, dstPath);
        } else {
          if (exists(dstPath) && !args.force) {
            appendOrSkip(srcPath, dstPath);
          } else {
            copyFile(srcPath, dstPath, args.force, args.dryRun);
          }
        }
      }
    }

    function appendOrSkip(srcPath, dstPath) {
      // For simple templates, prefer copying a new file with suffix if exists; here we skip to avoid overwriting
      if (args.dryRun) {
        log("dry-run", `would skip existing template: ${dstPath}`);
      } else {
        log("skip", `template exists: ${dstPath}`);
      }
    }

    copyDir(templatesDir, destTemplates);
  }

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

  const destSettingsPath = path.join(repo, ".vscode", "settings.json");
  if (exists(destSettingsPath) && !args.force) {
    log("merge", `merging existing settings: ${destSettingsPath}`);
    let existingSettings = {};
    try { existingSettings = readJSON(destSettingsPath); } catch (e) { log("warn", `failed reading existing settings: ${e.message}`); existingSettings = {}; }

    // merged should override existing where provided
    let finalSettings = mergeDeep(existingSettings, merged);

    // special merge for nested codeActions block
    if (existingSettings["editor.codeActionsOnSave"] || merged["editor.codeActionsOnSave"]) {
      finalSettings["editor.codeActionsOnSave"] = mergeDeep(existingSettings["editor.codeActionsOnSave"] ?? {}, merged["editor.codeActionsOnSave"] ?? {});
    }

    for (const k of Object.keys(merged)) {
      if (k.startsWith("[") && k.endsWith("]")) {
        finalSettings[k] = mergeDeep(existingSettings[k] ?? {}, merged[k] ?? {});
      }
    }

    writeJSON(destSettingsPath, finalSettings, true, args.dryRun);
  } else {
    writeJSON(destSettingsPath, merged, args.force, args.dryRun);
  }

  console.log(`\nDone. Applied ruleset: ${rules}`);
}

main();
