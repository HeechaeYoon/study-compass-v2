import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const fixtures = ["start", "question", "result", "prompt", "detail"] as const;

test.describe("visual fixtures", () => {
  for (const fixture of fixtures) {
    test(`${fixture} fixture captures at 1280x800`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`/?fixture=${fixture}`);
      await page.addStyleTag({
        content: "*,*::before,*::after{animation:none!important;transition:none!important}",
      });
      await page.evaluate(() => document.fonts.ready);
      const surface = page.getByTestId("screen-surface");
      await expect(surface).toBeVisible();
      const outputDir = path.join(process.cwd(), "artifacts", "visual");
      await mkdir(outputDir, { recursive: true });
      await page.screenshot({
        path: path.join(outputDir, `${fixture}-1280x800.png`),
        fullPage: false,
      });
      await surface.screenshot({
        path: path.join(outputDir, `${fixture}-surface.png`),
      });
    });
  }

  test("supported viewport smoke checks", async ({ page }) => {
    for (const viewport of [
      { width: 1024, height: 768 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1920, height: 1080 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/?fixture=prompt");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByTestId("screen-surface")).toBeVisible();
      await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
    }
  });

  test("prompt mode selector fits the canonical surface", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/?fixture=prompt");
    await page.evaluate(() => document.fonts.ready);

    const surfaceBox = await page.getByTestId("screen-surface").boundingBox();
    const modeBox = await page.locator(".promptModeSelector").boundingBox();
    const notebookBox = await page.locator(".notebookSheet").boundingBox();

    expect(surfaceBox).not.toBeNull();
    expect(modeBox).not.toBeNull();
    expect(notebookBox).not.toBeNull();
    if (!surfaceBox || !modeBox || !notebookBox) return;

    expect(modeBox.x).toBeGreaterThanOrEqual(surfaceBox.x);
    expect(modeBox.y).toBeGreaterThanOrEqual(surfaceBox.y);
    expect(modeBox.y + modeBox.height).toBeLessThanOrEqual(
      surfaceBox.y + surfaceBox.height,
    );
    expect(modeBox.x + modeBox.width).toBeLessThan(notebookBox.x);
  });
});
