import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const privacyScanScript = resolve("scripts/privacy-scan.mjs");

describe("privacy scan script", () => {
  it("fails release scans when dist has not been built", () => {
    const tempRoot = mkdtempSync(`${tmpdir()}/study-compass-privacy-scan-`);

    try {
      const result = spawnSync(process.execPath, [privacyScanScript], {
        cwd: tempRoot,
        encoding: "utf8",
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("dist/ not found; run npm run build before privacy:scan");
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
