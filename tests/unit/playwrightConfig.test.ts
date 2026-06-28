import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("playwright config", () => {
  it("uses an explicit strict preview port with test access env", () => {
    const config = readFileSync("playwright.config.ts", "utf8");

    expect(config).toContain('process.env.PLAYWRIGHT_PORT ?? "4173"');
    expect(config).toContain("--port ${playwrightPort} --strictPort");
    expect(config).toContain("MASTER_CODE=development-master-code");
    expect(config).toContain("ACCESS_CODE_REVISION=development-access-code-revision");
  });

  it("allows an external Playwright base URL to bypass the managed preview server", () => {
    const config = readFileSync("playwright.config.ts", "utf8");

    expect(config).toContain("process.env.PLAYWRIGHT_BASE_URL ?? defaultBaseURL");
    expect(config).toContain("const useExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL)");
  });
});
