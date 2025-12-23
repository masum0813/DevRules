#!/usr/bin/env node
/**
 * DevRules — Install to Repo (copy mode)
 *
 * This script is meant to be executed from ANYWHERE (typically from a target repo root),
 * while DevRules itself lives in a separate folder (e.g., cloned from GitHub).
 *
 * Examples (from target repo root):
 *   node /path/to/DevRules/tools/install-to-repo.mjs
 *   node /path/to/DevRules/tools/install-to-repo.mjs --force
 *   node /path/to/DevRules/tools/install-to-repo.mjs --rules python-fastapi
 *
 * What it does:
 * 1) Runs apply-rules.mjs (detect ruleset or use --rules)
 * 2) Copies templates (Makefile / justfile) if missing (or overwrite with --force)
 * 3) Optionally patches package.json scripts for Node repos (safe-add only)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const __dirname = new URL(".", import.meta.url).pathname;

function parseArgs(argv) {
  const args = {
    repo: process.cwd(),
    rules: null,
    force: false,
    dryRun: false,
    withMakefile: true,
    withJustfile: true,
    patchNpmScripts: true,
    help: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--repo") args.repo = argv[++i];
    else if (a === "--rules") args.rules = argv[++i];
    else if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--no-makefile") args.withMakefile = false;
    else if (a === "--no-justfile") args.withJustfile = false;
    else if (a === "--no-npm") args.patchNpmScripts = false;
    else if (a === "-h" || a === "--help") args.help = true;
  }
  return args;
}

function exists(p) {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
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

function safeReadJSON(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf-8")); } catch { return null; }
}

function writeJSON(p, obj, dryRun) {
  if (dryRun) {
    console.log(`WRITE ${p}`);
    return;
  }
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log(`WROTE : ${p}`);
}

function patchPackageJsonScripts(repo, devrulesDir, force, dryRun) {
  const pkgPath = path.join(repo, "package.json");
  if (!exists(pkgPath)) return;

  const pkg = safeReadJSON(pkgPath);
  if (!pkg || typeof pkg !== "object") {
    console.log(`SKIP  (invalid json): ${pkgPath}`);
    return;
  }

  pkg.scripts = pkg.scripts && typeof pkg.scripts === "object" ? pkg.scripts : {};

  const desired = {
    "devrules": `node ${devrulesDir}/tools/apply-rules.mjs --repo .`,
    "devrules:force": `node ${devrulesDir}/tools/apply-rules.mjs --repo . --force`,
    "devrules:dry": `node ${devrulesDir}/tools/apply-rules.mjs --repo . --dry-run`
  };

  let changed = false;
  for (const [k, v] of Object.entries(desired)) {
    if (!pkg.scripts[k]) {
      pkg.scripts[k] = v;
      changed = true;
      console.log(`ADD   script: ${k}`);
    } else if (force && pkg.scripts[k] !== v) {
      pkg.scripts[k] = v;
      changed = true;
      console.log(`SET   script: ${k}`);
    } else {
      console.log(`KEEP  script: ${k}`);
    }
  }

  if (changed) writeJSON(pkgPath, pkg, dryRun);
  else console.log("No changes to package.json scripts.");
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage: node tools/install-to-repo.mjs [--repo PATH] [--rules NAME] [--force] [--dry-run]
  --no-makefile   Do not copy Makefile template
  --no-justfile   Do not copy justfile template
  --no-npm        Do not patch package.json scripts (if package.json exists)
`);
    process.exit(0);
  }

  const repo = path.resolve(args.repo);

  // DevRules root is one level above tools/
  const devrulesRoot = path.resolve(path.join(__dirname, ".."));
  const applyScript = path.join(devrulesRoot, "tools", "apply-rules.mjs");
  const templatesDir = path.join(devrulesRoot, "templates");

  if (!exists(applyScript)) {
    console.error(`apply-rules.mjs not found at: ${applyScript}`);
    process.exit(2);
  }

  // 1) Run apply-rules.mjs
  const cmdArgs = [applyScript, "--repo", repo];
  if (args.rules) cmdArgs.push("--rules", args.rules);
  if (args.force) cmdArgs.push("--force");
  if (args.dryRun) cmdArgs.push("--dry-run");

  console.log(`\n==> Applying rules (repo: ${repo})`);
  const res = spawnSync(process.execPath, cmdArgs, { stdio: "inherit" });
  if (res.status !== 0) {
    process.exit(res.status ?? 2);
  }

  // 2) Copy templates (Makefile / justfile)
  console.log(`\n==> Installing helper templates`);
  if (args.withMakefile) {
    copyFile(path.join(templatesDir, "Makefile"), path.join(repo, "Makefile"), args.force, args.dryRun);
  }
  if (args.withJustfile) {
    copyFile(path.join(templatesDir, "justfile"), path.join(repo, "justfile"), args.force, args.dryRun);
  }

  // 3) Patch package.json scripts if present
  if (args.patchNpmScripts) {
    console.log(`\n==> Patching package.json scripts (if applicable)`);
    patchPackageJsonScripts(repo, devrulesRoot, args.force, args.dryRun);
  }

  console.log("\nDone. ✅");
}

main();
