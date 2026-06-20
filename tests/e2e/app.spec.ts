import { expect, test, type Page } from "@playwright/test";

const expectedOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
).origin;

async function answerAllQuestions(page: Page) {
  for (let index = 0; index < 16; index += 1) {
    await page.locator(".answerCard").nth(Math.min(2, await page.locator(".answerCard").count() - 1)).click();
    await page.getByRole("button", { name: index === 15 ? /다음/ : /다음/ }).click();
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
  await expect(page.getByText("현재 답변 기준")).toBeVisible();
  await page.getByRole("button", { name: /AI 프롬프트 만들기/ }).click();
  await page.getByLabel("과목").fill("수학");
  await page.getByLabel("단원").fill("일차함수");
  await page.getByLabel("이번 학습 목표").fill("그래프 해석하기");
  await expect(page.getByText("프롬프트 미리보기")).toBeVisible();
  expect(page.url()).not.toContain("수학");
  expect(page.url()).not.toContain("일차함수");
  expect(page.url()).not.toContain("그래프");
  expect(externalRequests).toEqual([]);
});

test("browser back returns to the previous questionnaire step without URL data", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.locator(".answerCard").nth(1).click();
  await page.getByRole("button", { name: /다음/ }).click();
  await expect(page.getByText(/2\s*\/\s*16/)).toBeVisible();

  await page.goBack();

  await expect(page.getByText(/1\s*\/\s*16/)).toBeVisible();
  await expect(page.locator(".answerCard").nth(1)).toHaveAttribute(
    "data-selected",
    "true",
  );
  expect(page.url()).not.toContain("answer");
  expect(page.url()).not.toContain("nickname");
});

test("memo is excluded by default and can be included", async ({ page }) => {
  await page.goto("/?fixture=prompt");
  await page.getByLabel("내가 보기엔 다른 점").fill("나는 문제풀이가 더 편해요.");
  await expect(page.locator(".promptPreview")).not.toContainText("나는 문제풀이가 더 편해요.");
  await page.getByLabel(/내가 쓴 메모/).check();
  await expect(page.locator(".promptPreview")).toContainText("나는 문제풀이가 더 편해요.");
});

test("save and delete latest result", async ({ page }) => {
  await page.goto("/?fixture=result");
  await page.getByRole("button", { name: /결과 저장/ }).click();
  await expect(page.getByRole("status")).toContainText("저장");
  await page.goto("/");
  await expect(page.getByText("저장된 결과가 있어요.")).toBeVisible();
  await page.getByRole("button", { name: "삭제" }).click();
  await page.getByRole("button", { name: "삭제하기" }).click();
  await expect(page.getByText("저장된 결과가 있어요.")).toBeHidden();
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
  await expect(page.locator("#manual-copy-text")).toContainText("현재 답변 기준");
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
  await expect(page.getByText(/현재 답변 기준으로는/)).toBeVisible();
});

test("image export downloads a safe summary filename", async ({ page }) => {
  await page.goto("/?fixture=result");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /이미지 저장/ }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(
    /^학습성향_[가-힣a-zA-Z0-9_-]+_\d{4}-\d{2}-\d{2}\.png$/,
  );
  await expect(page.getByRole("status")).toContainText("결과 이미지를 저장했어요");
});

test("wide-only guidance appears under 900px", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  await expect(page.getByText("이 활동은 가로 화면에 맞춰져 있어요.")).toBeVisible();
});
