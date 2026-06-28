import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { DAISY_COPYRIGHT_TEXT } from "../../src/data/ownership";

const fixtures = ["start", "question", "result", "prompt", "detail"] as const;
const allFixtures = ["access", ...fixtures] as const;
const COPYRIGHT_TEXT = DAISY_COPYRIGHT_TEXT;

async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    bodyScrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
  expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
}

async function expectElementInsideViewport(page: Page, selector: string): Promise<void> {
  const box = await page.locator(selector).boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  if (!viewport) return;

  expect(box.x).toBeGreaterThanOrEqual(-2);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 2);
}

async function captureViewport(
  page: Page,
  fixture: string,
  viewportName: string,
): Promise<void> {
  const outputDir = path.join(process.cwd(), "artifacts", "visual");
  await mkdir(outputDir, { recursive: true });
  await page.screenshot({
    path: path.join(outputDir, `${fixture}-${viewportName}.png`),
    fullPage: true,
  });
}

test.describe("visual fixtures", () => {
  for (const fixture of allFixtures) {
    test(`${fixture} fixture captures at 1280x800`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`/?fixture=${fixture}`);
      await page.addStyleTag({
        content: "*,*::before,*::after{animation:none!important;transition:none!important}",
      });
      await page.evaluate(() => document.fonts.ready);
      const surface = page.getByTestId("screen-surface");
      await expect(surface).toBeVisible();
      await expect(page.getByText(COPYRIGHT_TEXT).first()).toBeVisible();
      const watermarkContent = await surface.evaluate((element) =>
        window.getComputedStyle(element, "::after").content,
      );
      expect(watermarkContent).toBe(JSON.stringify(COPYRIGHT_TEXT));
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

  test("phone landscape compact fixtures render without the guidance", async ({ page }) => {
    for (const fixture of allFixtures) {
      await page.setViewportSize({ width: 844, height: 390 });
      await page.goto(`/?fixture=${fixture}`);
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByText("화면이 너무 좁아요.")).toBeHidden();
      await expect(page.getByTestId("screen-surface")).toBeVisible();
      await expectNoHorizontalScroll(page);
    }
  });

  test("phone portrait fixtures render without horizontal overflow", async ({ page }) => {
    for (const fixture of allFixtures) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/?fixture=${fixture}`);
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByText("화면이 너무 좁아요.")).toBeHidden();
      await expect(page.getByTestId("screen-surface")).toBeVisible();
      await expectNoHorizontalScroll(page);
      if (fixture === "detail") {
        await expect(
          page.getByRole("heading", { name: "지금의 공부 길을 한눈에 보기" }),
        ).toBeInViewport();
      }
      if (fixture === "prompt") {
        await expect(page.getByText(/로컬에서만 미리 만들어요/)).toBeInViewport();
      }
      await captureViewport(page, fixture, "390x844");
    }

    for (const fixture of ["detail", "prompt"] as const) {
      await page.setViewportSize({ width: 360, height: 740 });
      await page.goto(`/?fixture=${fixture}`);
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByText("화면이 너무 좁아요.")).toBeHidden();
      await expect(page.getByTestId("screen-surface")).toBeVisible();
      await expectNoHorizontalScroll(page);
      if (fixture === "detail") {
        await expect(
          page.getByRole("heading", { name: "지금의 공부 길을 한눈에 보기" }),
        ).toBeInViewport();
      } else {
        await expect(page.getByText(/로컬에서만 미리 만들어요/)).toBeInViewport();
      }
      await captureViewport(page, fixture, "360x740");
    }
  });

  test("prompt fixture fits at the compact landscape minimum width", async ({ page }) => {
    await page.setViewportSize({ width: 560, height: 375 });
    await page.goto("/?fixture=prompt");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.getByText("화면이 너무 좁아요.")).toBeHidden();
    await expect(page.getByTestId("screen-surface")).toBeVisible();
    await expectNoHorizontalScroll(page);
    await expectElementInsideViewport(page, ".promptFormPanel");
    await expectElementInsideViewport(page, ".notebookSheet");
    await expectElementInsideViewport(page, ".blueBacking");
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
