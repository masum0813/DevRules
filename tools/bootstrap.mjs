#!/usr/bin/env node
/**
 * DevRules — Bootstrap (no git, no unzip, cross-platform)
 *
 * Usage (recommended via curl one-liner):
 *   curl -fsSL https://raw.githubusercontent.com/masum0813/DevRules/main/tools/bootstrap.mjs | node - -- --repo .
 *
 * Options forwarded to install-to-repo.mjs:
 *   --repo PATH
 *   --rules swift|node-js|node-ts|python-fastapi|go|dotnet
 *   --force
 *   --dry-run
 *   --no-makefile --no-justfile --no-npm
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const OWNER = "masum0813";
const REPO = "DevRules";
const BRANCH = "main";

function parseArgs(argv) {
  // forward everything after `--` if present; else forward all args after script
  const idx = argv.indexOf("--");
  const forwarded = idx >= 0 ? argv.slice(idx + 1) : argv.slice(2);

  // default repo is current working directory unless user provided --repo
  const hasRepo = forwarded.includes("--repo");
  if (!hasRepo) forwarded.push("--repo", process.cwd());

  return forwarded;
}

async function httpJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": `${OWNER}-${REPO}-bootstrap`,
      "Accept": "application/vnd.github+json"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function httpText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": `${OWNER}-${REPO}-bootstrap`
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(dest, content) {
  // Strip UTF-8 BOM if present to avoid shebang parse failures.
  if (content.charCodeAt(0) === 0xfeff) {
    console.warn(`==> stripped BOM: ${dest}`);
    content = content.slice(1);
  }
  // If the first non-whitespace line is a shebang, ensure it starts at byte 0.
  if (/^\s*#!\//.test(content) && !content.startsWith("#!")) {
    console.warn(`==> normalized shebang offset: ${dest}`);
    content = content.replace(/^\s+/, "");
  }
  // Defensive: drop a stray leading backslash before a shebang (seen in some broken patches).
  if (content.startsWith("\\\n#!") || content.startsWith("\\\r\n#!")) {
    console.warn(`==> removed stray prefix before shebang: ${dest}`);
    content = content.replace(/^\\\\\r?\n/, "");
  }
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content, "utf-8");
}

function isNeeded(p) {
  // pull only what we need to run install-to-repo.mjs
  if (p === "tools/apply-rules.mjs") return true;
  if (p === "tools/install-to-repo.mjs") return true;

  if (p.startsWith("shared/")) return true;
  if (p.startsWith("templates/")) return true;
  if (p.startsWith("rulesets/")) return true;

  // ignore everything else
  return false;
}

async function main() {
  const forwardedArgs = parseArgs(process.argv);

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "devrules-"));
  const devrulesRoot = path.join(tmpRoot, `${REPO}-${BRANCH}`);

  console.log(`==> DevRules bootstrap`);
  console.log(`==> temp: ${tmpRoot}`);

  // 1) Get repository tree (recursive)
  const treeUrl = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const tree = await httpJson(treeUrl);

  if (!tree?.tree || !Array.isArray(tree.tree)) {
    throw new Error("Unexpected GitHub tree response.");
  }

  const files = tree.tree
    .filter((x) => x.type === "blob" && typeof x.path === "string")
    .map((x) => x.path)
    .filter(isNeeded);

  if (!files.length) {
    throw new Error("No files selected from repo tree. Check paths/branch.");
  }

  // 2) Download selected files from raw URL
  const rawBase = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/`;
  console.log(`==> downloading ${files.length} files...`);

  for (const rel of files) {
    const url = rawBase + rel;
    const content = await httpText(url);
    const dest = path.join(devrulesRoot, rel);
    writeFile(dest, content);
  }

  // 3) Execute install-to-repo.mjs from the temp DevRules folder
  const installPath = path.join(devrulesRoot, "tools", "install-to-repo.mjs");
  if (!fs.existsSync(installPath)) {
    throw new Error("install-to-repo.mjs not found after bootstrap download.");
  }

  console.log(`==> running install-to-repo.mjs ...`);
  const res = spawnSync(process.execPath, [installPath, ...forwardedArgs], { stdio: "inherit" });
  process.exit(res.status ?? 1);
}

main().catch((e) => {
  console.error(`\nBootstrap failed: ${e?.message ?? e}`);
  process.exit(2);
});
