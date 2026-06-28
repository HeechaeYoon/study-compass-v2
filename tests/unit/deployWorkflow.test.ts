import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("deploy pages workflow", () => {
  it("passes access-code env to the production build and privacy scan steps", () => {
    const workflow = readFileSync(".github/workflows/deploy-pages.yml", "utf8");

    expect(workflow).toContain("MASTER_CODE: ${{ secrets.MASTER_CODE }}");
    expect(workflow).toContain("ACCESS_CODE_REVISION: ${{ vars.ACCESS_CODE_REVISION }}");
    expect(workflow).toContain("run: npm run build");
    expect(workflow).toContain("run: npm run privacy:scan");
  });
});
