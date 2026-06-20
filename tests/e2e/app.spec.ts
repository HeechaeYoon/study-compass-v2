import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { PNG } from "pngjs";

const expectedOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
).origin;

async function answerAllQuestions(page: Page) {
  for (let index = 0; index < 16; index += 1) {
    const cards = page.locator(".answerCard");
    await cards.nth(Math.min(2, await cards.count() - 1)).click();
    if (index < 15) {
      await expect(page.getByText(new RegExp(`${index + 2}\\s*/\\s*16`))).toBeVisible();
    }
  }
  await expect(
    page.getByTestId("screen-surface").getByText(/현재 답변 기준으로는/),
  ).toBeVisible();
}

function meaningfulPixelRatio(png: PNG): number {
  let meaningful = 0;
  const total = png.width * png.height;

  for (let index = 0; index < png.data.length; index += 4) {
    const alpha = png.data[index + 3] ?? 255;
    if (alpha < 16) continue;
    const red = png.data[index] ?? 255;
    const green = png.data[index + 1] ?? 254;
    const blue = png.data[index + 2] ?? 252;
    const distance =
      Math.abs(red - 255) + Math.abs(green - 254) + Math.abs(blue - 252);
    if (distance > 28) meaningful += 1;
  }

  return meaningful / total;
}

test("standard flow works without nickname", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const requestUrl = new URL(request.url());
    if (requestUrl.protocol.startsWith("http") && requestUrl.origin !== expectedOrigin) {
      externalRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "시작하기" }).click();
  await answerAllQuestions(page);
  await expect(
    page.getByTestId("screen-surface").getByText(/현재 답변 기준으로는/),
  ).toBeVisible();
  await page.getByRole("button", { name: /AI 프롬프트 만들기/ }).click();
  await page.getByLabel("과목").fill("수학");
  await page.getByLabel("단원").fill("일차함수");
  await page.getByLabel("이번 학습 목표").fill("그래프 해석하기");
  await expect(page.getByText("프롬프트 미리보기")).toBeVisible();
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(page.getByText("학습 전략 가이드")).toHaveCount(0);
  expect(page.url()).not.toContain("수학");
  expect(page.url()).not.toContain("일차함수");
  expect(page.url()).not.toContain("그래프");
  expect(externalRequests).toEqual([]);
});

test("browser back returns to the previous questionnaire step without URL data", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.locator("[data-screen-heading]")).toBeFocused();
  await page.locator(".answerCard").nth(1).click();
  await expect(page.getByText(/2\s*\/\s*16/)).toBeVisible();

  await page.goBack();

  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
  await expect(page.locator(".answerCard").nth(1)).toHaveAttribute(
    "data-selected",
    "true",
  );
  await page.locator(".answerCard").nth(1).click();
  await page.waitForTimeout(800);
  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
  expect(page.url()).not.toContain("answer");
  expect(page.url()).not.toContain("nickname");
});

test("keyboard and reduced-motion users keep manual questionnaire pacing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.locator('input[type="radio"]').first().focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(800);
  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /다음/ }).click();
  await expect(page.getByText(/2\s*\/\s*16/)).toBeVisible();
  await page.locator(".answerCard").nth(1).click();
  await page.waitForTimeout(800);
  await expect(page.getByText(/2\s*\/\s*16/)).toBeVisible();
});

test("detail report opens as a readable screen and returns to summary", async ({ page }) => {
  await page.goto("/?fixture=result");
  await page.getByRole("button", { name: /상세 리포트 보기/ }).click();

  await expect(page.getByRole("heading", { name: "지금의 공부 길을 한눈에 보기" })).toBeVisible();
  await expect(page.getByText("학습 지도 리포트")).toBeVisible();
  await expect(page.getByRole("heading", { name: "내 학습 지도" })).toBeVisible();
  await expect(page.getByText("오늘의 성장 미션")).toBeVisible();
  await expect(page.getByText("피하면 좋은 방식")).toBeVisible();
  await page.getByRole("button", { name: /결과 요약/ }).click();
  await expect(page.getByRole("button", { name: /AI 프롬프트 만들기/ })).toBeVisible();
});

test("memo is excluded by default and can be included", async ({ page }) => {
  await page.goto("/?fixture=prompt");
  await expect(page.getByRole("button", { name: /프롬프트 생성하기/ })).toHaveCount(0);
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(page.getByText("학습 전략 가이드")).toHaveCount(0);
  await page.getByLabel("내가 보기엔 다른 점").fill("나는 문제풀이가 더 편해요.");
  await expect(page.locator(".promptPreview")).not.toContainText("나는 문제풀이가 더 편해요.");
  await page.getByLabel(/내가 쓴 메모/).check();
  await expect(page.locator(".promptPreview")).toContainText("나는 문제풀이가 더 편해요.");
});

test("prompt preview updates live and copy button confirms success", async ({ page }) => {
  await page.goto("/?fixture=prompt");
  await page.getByLabel("원하는 도움").fill("예시 문제를 두 개만 추천");
  await expect(page.locator(".promptPreview")).toContainText("예시 문제를 두 개만 추천");
  await page.getByRole("button", { name: "복사하기" }).click();
  await expect(page.getByRole("button", { name: "복사됨" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("AI 프롬프트를 복사했어요.");
  await expect(page.getByRole("button", { name: "복사하기" })).toBeVisible({
    timeout: 3500,
  });
  await page.getByRole("button", { name: /결과 요약으로/ }).click();
  await expect(page.getByRole("button", { name: /AI 프롬프트 만들기/ })).toBeVisible();
});

test("prompt utilities fit inside the canonical surface", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/?fixture=prompt");

  const surfaceBox = await page.getByTestId("screen-surface").boundingBox();
  const utilityBox = await page.locator(".promptUtility").boundingBox();
  expect(surfaceBox).not.toBeNull();
  expect(utilityBox).not.toBeNull();
  if (!surfaceBox || !utilityBox) return;
  expect(utilityBox.y + utilityBox.height).toBeLessThanOrEqual(
    surfaceBox.y + surfaceBox.height,
  );
});

test("save and delete latest result", async ({ page }) => {
  const uniqueMemo = "삭제 확인용 메모 6b47";
  await page.goto("/?fixture=prompt");
  await page.getByLabel("내가 보기엔 다른 점").fill(uniqueMemo);
  await page.getByLabel(/내가 쓴 메모/).check();
  await page.getByRole("button", { name: /결과 저장/ }).click();
  await expect(page.getByRole("status")).toContainText("저장");
  await page.goto("/");
  await expect(page.locator(".savedResultPanel")).toBeVisible();
  await page.getByRole("button", { name: "삭제" }).click();
  await page.getByRole("button", { name: "삭제하기" }).click();
  await expect(page.getByRole("status")).toContainText("저장된 결과를 삭제했어요.");
  await expect(page.getByRole("status")).toBeHidden({ timeout: 4500 });
  await expect(page.locator(".savedResultPanel")).toBeHidden();
  await expect(page.getByText(uniqueMemo)).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem("srl-coach-result-v1")),
    )
    .toBeNull();
});

test("manual copy fallback appears when clipboard methods fail", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("clipboard blocked")),
      },
    });
    document.execCommand = () => false;
  });

  await page.goto("/?fixture=prompt");
  await page.getByRole("button", { name: "복사하기" }).click();
  await expect(page.getByRole("dialog", { name: "수동으로 복사하기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "복사됨" })).toHaveCount(0);
  await expect(page.locator("#manual-copy-text")).toContainText("현재 답변 기준");
});

test("radar has no misleading visible scale legend", async ({ page }) => {
  await page.goto("/?fixture=result");
  await expect(page.locator(".radarLegend")).toHaveCount(0);
  await expect(page.getByText(/1 성장 포인트/)).toHaveCount(0);
  await expect(page.getByRole("img", { name: /학습 지도 결과/ })).toBeVisible();
});

test("storage failure does not break the result screen", async ({ page }) => {
  await page.addInitScript(() => {
    const brokenStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("quota", "QuotaExceededError");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: brokenStorage,
    });
  });

  await page.goto("/?fixture=result");
  await page.getByRole("button", { name: /결과 저장/ }).click();
  await expect(page.getByRole("status")).toContainText("저장하기 어려워요");
  await expect(
    page.getByTestId("screen-surface").getByText(/현재 답변 기준으로는/),
  ).toBeVisible();
});

test("image export downloads a safe summary filename", async ({ page }) => {
  await page.goto("/?fixture=prompt");
  await page.getByLabel("과목").fill("비밀과목 57ac");
  await page.getByLabel("내가 보기엔 다른 점").fill("비밀메모 57ac");
  await page.getByLabel(/내가 쓴 메모/).check();
  const exportCard = page.locator("[data-export-card]");
  await expect(exportCard).toContainText("강점");
  await expect(exportCard).toContainText("균형");
  await expect(exportCard).toContainText("추천 전략");
  await expect(exportCard).not.toContainText("비밀과목 57ac");
  await expect(exportCard).not.toContainText("비밀메모 57ac");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /이미지 저장/ }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(
    /^학습성향_[가-힣a-zA-Z0-9_-]+_\d{4}-\d{2}-\d{2}\.png$/,
  );
  const downloadedPath = await download.path();
  expect(downloadedPath).not.toBeNull();
  const png = PNG.sync.read(readFileSync(downloadedPath ?? ""));
  expect(png.width).toBeGreaterThanOrEqual(1800);
  expect(png.height).toBeGreaterThanOrEqual(1200);
  expect(meaningfulPixelRatio(png)).toBeGreaterThan(0.01);
  await expect(page.getByRole("status")).toContainText("결과 이미지를 저장했어요");
});

test("wide-only guidance appears under 900px", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  await expect(page.getByText("이 활동은 가로 화면에 맞춰져 있어요.")).toBeVisible();
});
