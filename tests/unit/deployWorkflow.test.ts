import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("deploy pages workflow", () => {
  it("passes the MASTER_CODE secret to the production build step", () => {
    const workflow = readFileSync(".github/workflows/deploy-pages.yml", "utf8");

    expect(workflow).toContain("MASTER_CODE: ${{ secrets.MASTER_CODE }}");
    expect(workflow).toContain("run: npm run build");
  });
});
