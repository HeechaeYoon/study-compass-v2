#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

const runtimeRules = [
  { name: "fetch call", pattern: /\bfetch\s*\(/g },
  { name: "XMLHttpRequest", pattern: /\bXMLHttpRequest\b/g },
  { name: "sendBeacon", pattern: /\bsendBeacon\s*\(/g },
  { name: "WebSocket", pattern: /\bWebSocket\b/g },
  {
    name: "analytics marker",
    pattern: /\b(?:analytics|gtag|dataLayer|mixpanel|segment|amplitude|posthog|plausible)\b/gi,
  },
  { name: "console logging", pattern: /\bconsole\.(?:log|debug|info|warn|error)\s*\(/g },
];

const distForbiddenValues = [
  { name: "development master code", value: "development-master-code" },
  { name: "development access-code revision", value: "development-access-code-revision" },
  { name: "placeholder master code", value: "replace-with-private-master-code" },
  { name: "placeholder access-code revision", value: "replace-to-revoke" },
  { name: "fixture env flag", value: "VITE_ENABLE_FIXTURES=true" },
  { name: "fixture nickname", value: "민트고래" },
  { name: "fixture prompt goal", value: "식과 그래프 관계를 설명하기" },
];

for (const envName of ["MASTER_CODE", "ACCESS_CODE_REVISION"]) {
  const value = process.env[envName];
  if (value && value.length >= 6) {
    distForbiddenValues.push({ name: `raw ${envName}`, value });
  }
}

function relative(filePath) {
  return path.relative(root, filePath) || ".";
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(dir, predicate) {
  const files = [];
  if (!(await pathExists(dir))) return files;

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && predicate(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

function lineAndColumn(content, index) {
  const prefix = content.slice(0, index);
  const lines = prefix.split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

async function scanRuntimeSource() {
  const files = await collectFiles(path.join(root, "src"), (filePath) =>
    /\.(?:ts|tsx)$/.test(filePath),
  );

  for (const filePath of files) {
    const content = await readFile(filePath, "utf8");
    for (const rule of runtimeRules) {
      rule.pattern.lastIndex = 0;
      let match = rule.pattern.exec(content);
      while (match) {
        const position = lineAndColumn(content, match.index);
        failures.push(
          `${relative(filePath)}:${position.line}:${position.column} runtime source contains ${rule.name}`,
        );
        match = rule.pattern.exec(content);
      }
    }
  }
}

async function scanDist() {
  const distDir = path.join(root, "dist");
  if (!(await pathExists(distDir))) {
    failures.push("dist/ not found; run npm run build before privacy:scan");
    return;
  }

  const files = await collectFiles(distDir, (filePath) =>
    /\.(?:html|js|css|json|svg|txt|map)$/.test(filePath),
  );

  for (const filePath of files) {
    const content = await readFile(filePath, "utf8");
    for (const forbidden of distForbiddenValues) {
      if (!forbidden.value) continue;
      const index = content.indexOf(forbidden.value);
      if (index === -1) continue;
      const position = lineAndColumn(content, index);
      failures.push(
        `${relative(filePath)}:${position.line}:${position.column} dist contains ${forbidden.name}`,
      );
    }
  }
}

await scanRuntimeSource();
await scanDist();

if (failures.length > 0) {
  console.error("privacy:scan failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("privacy:scan passed: runtime source has no app-level network/logging path and dist has no raw access-code secrets or fixture markers.");
