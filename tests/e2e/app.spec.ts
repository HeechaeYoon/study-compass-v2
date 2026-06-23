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

async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    bodyScrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
  expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 2);
}

async function expectPageAtTop(page: Page): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)))
    .toBeLessThanOrEqual(1);
}

async function expectMinimumControlHeight(
  page: Page,
  selector: string,
  minimumHeight = 44,
): Promise<void> {
  const heights = await page.locator(selector).evaluateAll((elements) =>
    elements.map((element) => {
      const htmlElement = element as HTMLElement;
      return {
        ariaHidden: htmlElement.getAttribute("aria-hidden"),
        disabled:
          htmlElement instanceof HTMLButtonElement ||
          htmlElement instanceof HTMLInputElement ||
          htmlElement instanceof HTMLTextAreaElement
            ? htmlElement.disabled
            : false,
        height: htmlElement.getBoundingClientRect().height,
      };
    }),
  );
  const enabledHeights = heights
    .filter((item) => !item.disabled && item.ariaHidden !== "true")
    .map((item) => item.height);

  expect(enabledHeights.length).toBeGreaterThan(0);
  for (const height of enabledHeights) {
    expect(height).toBeGreaterThanOrEqual(minimumHeight);
  }
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
  await expect(
    page.getByTestId("screen-surface").getByText(/고정된 성격이나 능력이 아니라/),
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

test("question home button returns to start so nickname can be added", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
  await expect(page.getByRole("button", { name: "처음으로" })).toBeVisible();

  await page.locator(".answerCard").nth(1).click();
  await expect(page.getByText(/2\s*\/\s*16/)).toBeVisible();
  await page.getByRole("button", { name: "처음으로" }).click();

  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toBeVisible();
  await page.getByLabel(/닉네임을 입력/).fill("다시입력");
  await page.getByRole("button", { name: "시작하기" }).click();

  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
  await expect(page.locator(".answerCard").nth(1)).toHaveAttribute(
    "data-selected",
    "false",
  );
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
  await expect(page.getByRole("heading", { name: "왜 이렇게 봤나요?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "내 학습 지도" })).toBeVisible();
  await expect(page.getByText("오늘의 성장 미션")).toBeVisible();
  await expect(page.getByText("피하면 좋은 방식")).toBeVisible();
  await page.getByRole("button", { name: /결과 요약/ }).click();
  await expect(page.getByRole("button", { name: /AI 프롬프트 만들기/ })).toBeVisible();
});

test("memo is included automatically and prompt modes switch preview purpose", async ({ page }) => {
  await page.goto("/?fixture=prompt");
  await expect(page.getByText(/아직 AI로 보내지지 않아요/)).toBeVisible();
  await expect(page.getByText(/민감한 개인정보를 빼주세요/)).toBeVisible();
  await expect(page.getByRole("button", { name: /프롬프트 생성하기/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /상세 리포트 복사/ })).toHaveCount(0);
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(page.getByText("학습 전략 가이드")).toHaveCount(0);
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await page.getByLabel("내가 보기엔 다른 점").fill("나는 문제풀이가 더 편해요.");
  await expect(page.locator(".promptPreview")).toContainText("나는 문제풀이가 더 편해요.");
  await expect(page.locator(".promptPreview")).toContainText("30~40분");

  await page.getByRole("button", { name: "개념 학습" }).click();
  await expect(page.locator(".promptPreview")).toContainText("개념 학습용 설명");
  await expect(page.locator(".promptPreview")).toContainText("확인문제 3개");

  await page.getByRole("button", { name: "계획 이미지" }).click();
  await expect(page.locator(".promptPreview")).toContainText("학습 계획 인포그래픽");
  await expect(page.locator(".promptPreview")).toContainText("이미지에 그대로 쓰지 말 것");

  await page.getByRole("button", { name: "개념 이미지" }).click();
  await expect(page.locator(".promptPreview")).toContainText("개념 학습 인포그래픽");
});

test("prompt preview updates live and copy button confirms success", async ({ page }) => {
  await page.goto("/?fixture=prompt");
  await page.getByLabel("원하는 도움").fill("예시 문제를 두 개만 추천");
  await expect(page.locator(".promptPreview")).toContainText("예시 문제를 두 개만 추천");
  await expect(page.locator(".promptPreview")).toContainText("자동으로 전송하지 않습니다");
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

test("phone portrait renders the app at supported widths", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 360, height: 740 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.getByText("화면이 너무 좁아요.")).toBeHidden();
    await expect(
      page.getByTestId("screen-surface").getByRole("heading", {
        name: /나의 공부 스타일을/,
      }),
    ).toBeVisible();
    await expectNoHorizontalScroll(page);
  }
});

test("phone portrait below the minimum width keeps the guidance", async ({ page }) => {
  await page.setViewportSize({ width: 359, height: 740 });
  await page.goto("/");
  await expect(page.getByText("화면이 너무 좁아요.")).toBeVisible();
  await expect(
    page.getByText("조금 더 넓은 화면이나 가로 모드에서 다시 열어주세요."),
  ).toBeVisible();
  await expect(page.getByTestId("screen-surface")).toBeHidden();
});

test("phone landscape renders the app instead of the guidance", async ({ page }) => {
  for (const viewport of [
    { width: 844, height: 390 },
    { width: 667, height: 375 },
    { width: 560, height: 375 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.getByText("화면이 너무 좁아요.")).toBeHidden();
    await expect(
      page.getByTestId("screen-surface").getByRole("heading", {
        name: /나의 공부 스타일을/,
      }),
    ).toBeVisible();
    await expectNoHorizontalScroll(page);
  }
});

test("phone landscape below the compact minimum keeps the guidance", async ({ page }) => {
  await page.setViewportSize({ width: 559, height: 375 });
  await page.goto("/");

  await expect(page.getByText("화면이 너무 좁아요.")).toBeVisible();
  await expect(page.getByTestId("screen-surface")).toBeHidden();
});

test("phone landscape can complete the questionnaire flow", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  await expect(
    page.getByTestId("screen-surface").getByRole("heading", {
      name: /나의 공부 스타일을/,
    }),
  ).toBeVisible();
  await expectNoHorizontalScroll(page);

  await page.getByRole("button", { name: "시작하기" }).click();
  await answerAllQuestions(page);

  await expect(
    page.getByTestId("screen-surface").getByText(/현재 답변 기준으로는/),
  ).toBeVisible();
  await expectNoHorizontalScroll(page);
});

for (const viewport of [
  { label: "390x844", width: 390, height: 844 },
  { label: "360x740", width: 360, height: 740 },
]) {
  test(`phone portrait can complete the core learning flow at ${viewport.label}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(
      page.getByTestId("screen-surface").getByRole("heading", {
        name: /나의 공부 스타일을/,
      }),
    ).toBeVisible();
    await page.getByLabel(/닉네임을 입력/).fill(`모바일학생${viewport.width}`);
    await expectNoHorizontalScroll(page);

    await page.getByRole("button", { name: "시작하기" }).click();
    await answerAllQuestions(page);
    await expectMinimumControlHeight(page, ".resultActions button");
    await expectNoHorizontalScroll(page);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("button", { name: /상세 리포트 보기/ }).click();
    await expectPageAtTop(page);
    await expect(
      page.getByRole("heading", { name: "지금의 공부 길을 한눈에 보기" }),
    ).toBeInViewport();
    await expectMinimumControlHeight(page, ".detailHeader button");
    await expectNoHorizontalScroll(page);

    await page.getByRole("button", { name: /결과 요약/ }).click();
    await expectPageAtTop(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.getByRole("button", { name: /AI 프롬프트 만들기/ }).click();
    await expectPageAtTop(page);
    await expect(page.getByText(/입력한 내용과 메모는/)).toBeInViewport();
    await expectMinimumControlHeight(
      page,
      ".promptTopNav button, .promptModeButton, .promptFields .input, .promptUtility button, .copyButton",
    );

    await page.getByLabel("과목").fill("수학");
    await page.getByRole("button", { name: "복사하기" }).click();
    await expect(page.getByRole("button", { name: "복사됨" })).toBeVisible();
    await page.getByRole("button", { name: /결과 저장/ }).click();
    await expect(page.getByRole("status")).toContainText("저장");
    await page.getByRole("button", { name: /저장 결과 삭제/ }).click();
    await page.getByRole("button", { name: "삭제하기" }).click();
    await expect(page.getByRole("status")).toContainText("저장된 결과를 삭제했어요.");
    await expect(page.getByLabel(/닉네임을 입력/)).toHaveValue("");
    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem("srl-coach-result-v1")),
      )
      .toBeNull();
    await expectNoHorizontalScroll(page);
  });
}
